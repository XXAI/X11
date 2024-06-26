import { Component, Inject, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TrabajadorService } from '../trabajador.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DocumentacionImportacionDialogComponent } from '../../tramites/documentacion-importacion-dialog/documentacion-importacion-dialog.component';
import { VerInformacionDialogComponent } from '../../tramites/ver-informacion-dialog/ver-informacion-dialog.component';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface VerEmpleadoData {
  id: number;
  puedeEditar?:boolean;
  puedeVerFecha?:boolean;
  cluesAsistencia?:any;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VerComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<VerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerEmpleadoData,
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService,
    private sharedService: SharedService,
    public dialog: MatDialog, 
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;

  dataTrabajador: any;
  mediaSize: string;
  disabledDownload:boolean = false;
  cargadoFechas:boolean = false;
  cluesAsistencia = [];

  datosCredencial:any;
  fotoTrabajador = 'assets/profile-icon.svg';
  Asitencia:boolean = false;
  url           = `${environment.base_url_file}`;

  puedeVerAsistencias: boolean = false;
  puedeEditar:boolean = false;
  dataSource = [];
  dataTramites = [];//[{tramite:'COMISIÓN', periodo:'---', acuse:'---', estatus:1}];
  displayedColumns: string[] = ['institucion','grado','descripcion','cedula']; //'Agente',
  displayedColumnsTramite: string[] = ['tramite','periodo', 'archivo', 'estatus']; //'Agente',
  estatusDocumentacion:string[] = ['', 'ENVIADO','RECHAZADO', 'EN VALIDACIÓN', "RECHAZADO", "VALIDADO"];
  estatusChip:number = 0;
  navTabSelected:number = 0;
  pestanaTramites:boolean = false;
  validadorEstudios:boolean = false;
  datosNominales:any;

  pageEvent: PageEvent;
  pageSize: number = 5;
  resultsLength: number = 0;
  currentPage: number = 0;
  selectedItemIndex: number = -1;
  dataAsistencia:any = [];
  superUser:boolean = false;

  verInfoExpediente:boolean = true;
  datosFiscales:any;
  descargarConstancia:boolean = false;

  //Para el listado de las asistencias
  isLoadingAsistencia:boolean = false;
  asistenciasCargadas:boolean = false;
  verifData:any = { id:0, faltas:0, retardos:0 };
  fechaInicioAsist: any;
  fechaFinAsist: any;
  displayedScheduleColumns: string[] = ['dia','fecha','hora_entrada','hora_salida','justificado'];
  arregloTipoTramite: string[] = ['', 'Comisión'];
  assistSource: any = [];
  resumenAsistencias: any;
  daysLabels: any = {
    1:"LUNES", 
    2:"MARTES", 
    3:"MIERCOLES", 
    4:"JUEVES", 
    5:"VIERNES", 
    6:"SABADO", 
    7:"DOMINGO",
    8: "DIAS FESTIVOS"
  };

  miniPagination:any = {
    previous: 0,
    current: 0,
    next: 0,
    total: 0
  };

  isLoadingCredential:boolean = false;
  isLoadingPDF:boolean = false;
  isLoading:boolean = false;

  ngOnInit() {
    let userPermissions = JSON.parse(localStorage.getItem('permissions'));
    let user = JSON.parse(localStorage.getItem('user'));
    
    if(user.is_superuser == 1)
    {
      this.superUser = true;
    }
    if(this.data.puedeVerFecha)
    {
      this.superUser = true;
    }
    /*if(userPermissions['NZlDkhi8ikVhdgfT8zVVIGroFNtHfIQe']){
      this.puedeVerAsistencias = true;
    }else{
      this.puedeVerAsistencias = false;
    }*/
    let resta_dias = new Date();
    resta_dias.setDate(resta_dias.getDate() - 5);
    
    this.fechaInicioAsist = resta_dias.toISOString();
    this.fechaFinAsist = new Date().toISOString();
  
    this.cluesAsistencia = this.data.cluesAsistencia;
   
    if(this.data.puedeEditar){
      this.puedeEditar = this.data.puedeEditar;
    }
    
    this.loadDataTrabajador(this.data.id);
  }

  public verAsistencia(event?:PageEvent){
    //rellenarAsistencia(page:number, datos:any)
    console.log(event);
    let page = event.pageIndex;
    this.rellenarAsistencia(page);
    return event;
  }
  
  loadDataTrabajador(id:any){
    let params = {};

    //Inicia: Datos para los botones de Anterior y Siguiente
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    let filter = this.sharedService.getDataFromCurrentApp('filter');
    let query = this.sharedService.getDataFromCurrentApp('searchQuery');

    for (let i in paginator) {
      params[i] = paginator[i];
    }

    for (let i in filter) {
      if(filter.clues){       params['clues']     = filter.clues.clues; }
      if(filter.cr){          params['cr']        = filter.cr.cr; }
      if(filter.estatus){     params['estatus']   = filter.estatus.id; }
      if(filter.rama){        params['rama']      = filter.rama.id; }
      if(filter.grupos){      params['grupos']    = filter.grupos.id; }
    }

    if(query){
      params['query'] = query;
    }
    //Termina: Datos para los botones de Anterior y Siguiente

    this.isLoadingCredential = true;
    this.isLoading = true;

    this.trabajadorService.verInfoTrabajador(id,params).subscribe(
      response =>{
        //console.log("--");
        this.dataTrabajador = response;
        //console.log(this.dataTrabajador);
        //console.log("--");
        this.dataSource = this.dataTrabajador.escolaridad;
        //this.verTramites(response.id);
        this.Asitencia = (response.actualizado == 0)?false:true;
        

        this.datosNominales = this.dataTrabajador.rel_datos_laborales_nomina;
        
        if(this.dataTrabajador.rel_trabajador_documentos != null)
        {
          this.verInfoExpediente = false;
        }

        if(this.dataTrabajador.rel_datos_laborales.cr_fisico != null)
        {
          if(this.verificarAsistencia(this.dataTrabajador.rel_datos_laborales.cr_fisico.clues))
          {
            if(this.dataTrabajador.rel_datos_comision == null)
            {
              this.puedeVerAsistencias = true;
            }
          }
        }
        
        if(this.dataTrabajador.escolaridad.length >= this.verificarEstudios(this.dataTrabajador.nivel_maximo_id))
        {
          this.validadorEstudios = true;
        }
    
        /*if(this.dataTrabajador.rel_datos_laborales_nomina)
        {
          if(this.dataTrabajador.rel_datos_laborales.cr_fisico_id != this.dataTrabajador.rel_datos_laborales_nomina.cr_nomina_id)
          {
            if(this.dataTrabajador.rel_datos_laborales_nomina.ur !='610'  && this.dataTrabajador.rel_datos_comision == null)
            {
              this.pestanaTramites = true;
            }
            
          }
        }*/

        this.datosFiscales = this.dataTrabajador.rel_datos_fiscales;

        if(this.dataTrabajador.rel_trabajador_documentos != null)
        {
          this.estatusChip = this.dataTrabajador.rel_trabajador_documentos.estatus;
        }else{
          this.estatusChip = null;
        }

        //Ver foto
        if(this.dataTrabajador.credencial != null) 
        {
          if(this.dataTrabajador.credencial.foto == 1)
          {
            this.fotoTrabajador = "data:image/png;base64,"+this.dataTrabajador.credencial.foto_trabajador;
          }else{

          }
        }else{
          this.fotoTrabajador = 'assets/trabajador.jpg';
        }
        this.isLoadingCredential = false;
        //console.log(this.dataTrabajador.rel_datos_laborales.cr_fisico_id +" - "+ this.dataTrabajador.rel_datos_laborales_nomina.cr_nomina_id);
        //console.log(this.pestanaTramites);
        
        /*if(this.dataTrabajador.clave_credencial){
          this.trabajadorService.getDatosCredencial(this.dataTrabajador.clave_credencial).subscribe(
            response => {
              //console.log(response);
              if(response.length > 0){
                this.datosCredencial = response[0];
                if(this.datosCredencial.tieneFoto == '1'){
                  this.datosCredencial.photo = 'http://credencializacion.saludchiapas.gob.mx/images/credenciales/'+this.datosCredencial.id+'.'+this.datosCredencial.tipoFoto;
                }else{
                  //this.datosCredencial.photo = this.photoPlaceholder;
                }
              }else{
                this.datosCredencial = undefined;
              }
              this.isLoadingCredential = false;
            },
            responseError => {
              console.log(responseError);
              this.isLoadingCredential = false;
            }
          );
        }*/

        this.isLoading = false;
      });
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  verConstancia()
  {
    this.descargarConstancia =true;
    this.trabajadorService.getConstancia(this.dataTrabajador.id).subscribe(
      response => {
        //saveAs(response, "download.pdf");
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.descargarConstancia = false;
      },
      responsError =>{
        this.descargarConstancia = false;
        this.sharedService.showSnackBar('Error al intentar descargar el expediente', null, 4000);
      }
    );
  }

  verificarAsistencia(obj:any)
  {
    //console.log(obj);
    let bandera:boolean = false;
    //console.log(this.cluesAsistencia);
    if(this.cluesAsistencia.length > 0)
    {
      this.cluesAsistencia.forEach(element => {
        if(element == obj)
        {
          bandera = true;
        }
      });
    }
    //console.log();
    return bandera;
  }

  verificarEstudios(valor)
  {
    
    let cantidad_estudios:number = 0;
    switch(valor)
    {
      case 2039842:
        cantidad_estudios = 0; break;
      case 2039843:
        cantidad_estudios = 1; break;
      case 2039846:
        cantidad_estudios = 0; break;
      case 2039847:
        cantidad_estudios = 0; break;
      case 2039848:
        cantidad_estudios = 1; break;
      case 2039849:
        cantidad_estudios = 1; break;
      case 2039850:
        cantidad_estudios = 1; break;
      case 2039851:
        cantidad_estudios = 1; break;
      case 2039852:
        cantidad_estudios = 2; break;
      case 2039853:
        cantidad_estudios = 3; break;
      case 2039854:
        cantidad_estudios = 2; break;
      case 2039855:
        cantidad_estudios = 2; break;
      case 2039856:
        cantidad_estudios = 1; break;
      case 2039857:
        cantidad_estudios = 0; break;
    }
   
    return cantidad_estudios;
  }


  verExpediente(obj:any)
  {
    //console.log(!this.verInfoExpediente);
    //console.log(obj);
    if(!this.verInfoExpediente)
    {
      if(obj.rel_trabajador_documentos.estatus == 2 || obj.rel_trabajador_documentos.estatus == 4)
      {
        this.cargarDetalles(obj);
      }else
      {
        //window.open(this.url+`\\documentacion\\`+obj.id+`.pdf`, "_blank");
        /* Cargando pdf */
        this.trabajadorService.getExpediente(obj.id).subscribe(
          response => {
            //saveAs(response, "download.pdf");
            const file = new Blob([response], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          },
          responsError =>{
            this.sharedService.showSnackBar('Error al intentar descargar el expediente', null, 4000);
          }
        );
      }
    }else{
      //console.log(obj);
      this.CargarDocumento(obj);
      
    }
    
  }

  public cargarDetalles(obj)
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '60%',
        width: '100%',
        data:{scSize:this.mediaSize, id: obj.id, rfc: obj.rfc, nombre: obj.nombre+" "+obj.apellido_paterno+" "+obj.apellido_materno, arreglo:obj.rel_trabajador_documentos.detalles, observacion:obj.rel_trabajador_documentos.observacion}
      };
    }else{
      configDialog = {
        width: '30%',
        data:{ id: obj.id, rfc: obj.rfc, nombre: obj.nombre+" "+obj.apellido_paterno+" "+obj.apellido_materno, arreglo:obj.rel_trabajador_documentos.detalles, observacion:obj.rel_trabajador_documentos.observacion }
      }
    }
    const dialogRef = this.dialog.open(VerInformacionDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
      }
    });
  }

  public CargarDocumento(obj)
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        //maxWidth: '200vw',
        //maxHeight: '100vh',
        height: '95%',
        width: '100%',
        data:{scSize:this.mediaSize, id: obj.id, rfc: obj.rfc, nombre: obj.nombre+" "+obj.apellido_paterno+" "+obj.apellido_materno, tipo:1}
      };
    }else{
      configDialog = {
        width: '60%',
        data:{ id: obj.id, rfc: obj.rfc, nombre: obj.nombre+" "+obj.apellido_paterno+" "+obj.apellido_materno, tipo:1}
      }
    }
    //console.log(configDialog);
    const dialogRef = this.dialog.open(DocumentacionImportacionDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadDataTrabajador(this.data.id);
      }
      //this.loadTrabajadorData();
    });
  }

  loadNext(){
    let nextId = this.miniPagination.next;
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');

    if(paginator.selectedIndex+1 >= paginator.pageSize){
      paginator.pageIndex += 1;
      paginator.selectedIndex = 0;
    }else{
      paginator.selectedIndex += 1;
    }

    this.sharedService.setDataToCurrentApp('paginator',paginator);
    this.loadDataTrabajador(nextId);
  }

  loadPrevious(){
    let prevId = this.miniPagination.previous;
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    
    if(paginator.selectedIndex-1 < 0){
      paginator.pageIndex -= 1;
      paginator.selectedIndex = paginator.pageSize-1;
    }else{
      paginator.selectedIndex -= 1;
    }

    this.sharedService.setDataToCurrentApp('paginator',paginator);
    this.loadDataTrabajador(prevId);
  }

  editarEmpleado(){
    this.dialogRef.close();
    this.router.navigate(['/trabajadores/editar/'+this.dataTrabajador.id]);
  }

  dataTabChange(event){
    
    if(event.index == 3 && this.puedeVerAsistencias && this.cargadoFechas == false){
      //console.log('corriendo listado de asistencia');
      this.cargadoFechas = true;
      this.cargarAssistencias(this.dataTrabajador.clave_credencial, this.fechaInicioAsist, this.fechaFinAsist);
    }
  }

  buscarFechasAssitencia(){
    //console.log(typeof this.fechaInicioAsist);
    let fecha_inicio:any;
    let fecha_fin:any;
    if(typeof this.fechaInicioAsist != "string")
    {
      fecha_inicio = this.fechaInicioAsist.toISOString().slice(0,10);
      fecha_fin = this.fechaFinAsist.toISOString().slice(0,10);
    }else
    {
      fecha_inicio = this.fechaInicioAsist.slice(0,10);
      fecha_fin = this.fechaFinAsist.slice(0,10);  
    }
    this.cargarAssistencias(this.dataTrabajador.clave_credencial, fecha_inicio, fecha_fin);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
  
  cargarAssistencias(rfc:string, fecha_inicial?, fecha_final?){
    let payload:any = {};

    payload.rfc = '"'+rfc+'"';

    if(fecha_inicial){
      payload.fecha_inicio = fecha_inicial;
      payload.fecha_fin = fecha_final;
    }/*else{
      let fecha_actual = new Date();
      let resta_dias = new Date();
      resta_dias.setDate(resta_dias.getDate() - 5);
      payload.fecha_inicio = resta_dias.toISOString().slice(0,10);
      payload.fecha_fin = fecha_actual.toISOString().slice(0,10);
    
    }*/
   

    this.isLoadingAsistencia = true;
    this.assistSource = [];
    this.verifData = 0;

    this.trabajadorService.getDatosAsistencia(payload).subscribe(
      response => {
          this.dataAsistencia = response.data;
          this.rellenarAsistencia(0);
          
          let startingDate = new Date(response.fecha_inicial+'T00:00:00');
          console.log(startingDate);

          this.fechaInicioAsist = new Date(response.fecha_inicial.substring(0,4),(response.fecha_inicial.substring(5,7)-1), response.fecha_inicial.substring(8,10),12,0,0,0);
          this.fechaFinAsist = new Date(response.fecha_final.substring(0,4),(response.fecha_final.substring(5,7)-1), response.fecha_final.substring(8,10),12,0,0,0);

          this.resumenAsistencias = response.resumen[0];
          this.verifData = { id: response.validacion.Badgenumber, faltas: response.resumen[0].Falta, retardos: response.resumen[0].Retardo_Mayor + response.resumen[0].Retardo_Menor};
          this.isLoadingAsistencia = false;
          this.asistenciasCargadas = true;
        
      },
      responsError =>{
        console.log(responsError);
        this.fechaInicioAsist = new Date();
        this.fechaFinAsist = new Date();
        this.isLoadingAsistencia = false;
        this.asistenciasCargadas = false;
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );
  }

  rellenarAsistencia(page:number)
  {
    let conversionAsistencia = [];
    let tamano = 0;
    let bandera = 1;
    let inicio = page * 5;
    for(let i in this.dataAsistencia){
      if(bandera < 6 && inicio <= tamano)
      {
        conversionAsistencia.push(this.dataAsistencia[i]);
        bandera++;
      }
      tamano++;
    }
    this.resultsLength = tamano;
    this.assistSource = conversionAsistencia;
  }

  reporteAsistencias(){
    this.isLoadingPDF = true;
    const reportWorker = new ReportWorker();
    reportWorker.onmessage().subscribe(
      data => {
        console.log("reporte");
        console.log(data.data);
        FileSaver.saveAs(data.data,'ReporteAsistencia');
        reportWorker.terminate();

        this.isLoadingPDF = false;
    });

    reportWorker.onerror().subscribe(
      (data) => {
        //this.sharedService.showSnackBar('Error: ' + data.message,null, 3000);
        this.isLoadingPDF = false;
        //console.log(data);
        reportWorker.terminate();
      }
    );

    let estatus_empleado = '';

    switch (this.dataTrabajador.estatus) {
      case 1:
        estatus_empleado = 'Activo';
        break;
      case 2:
        estatus_empleado = 'Dado de Baja';
        break;
      case 3:
        estatus_empleado = 'Inactivo';
        break;
      case 4:
        estatus_empleado = 'En Transferencia';
        break;
      default:
        break;
    }

    //console.log(this.dataTrabajador.rel_datos_laborales.jornada.descripcion);
    
   let datohorario = "";
   
   if(this.dataTrabajador.horario.length >0)
    {
      datohorario = 'de ' + this.dataTrabajador.horario[0].entrada.substr(0,5)+" al "+ this.dataTrabajador.horario[0].salida.substr(0,5);
    }

    let reportData = {
      fecha_inicial: this.fechaInicioAsist.toISOString().substring(0,10),
      fecha_final: this.fechaFinAsist.toISOString().substring(0,10),
      nombre: this.dataTrabajador.apellido_paterno + ' ' + this.dataTrabajador.apellido_materno + ' ' + this.dataTrabajador.nombre,
      rfc: this.dataTrabajador.rfc,
      curp: this.dataTrabajador.curp,
      id: this.verifData.id,
      estatus: estatus_empleado,
      lugar:(this.dataTrabajador.rel_datos_laborales)?this.dataTrabajador.rel_datos_laborales.cr_fisico.descripcion:'',
      turno:(this.dataTrabajador.rel_datos_laborales.jornada)?this.dataTrabajador.rel_datos_laborales.jornada.descripcion:'',
      horario: datohorario,
      resumen: this.resumenAsistencias
    };
    console.log(reportData);
    //console.log(reportData);
    reportWorker.postMessage({data:{items: this.dataAsistencia, data: reportData },reporte:'empleados/personal-asistencia'});
  }

  solicitar(valor:number, trabajador_id:string)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea renovar su oficio de comisión? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.trabajadorService.setTramite(valor, trabajador_id).subscribe(
          response => {
            this.sharedService.showSnackBar("Se guardo correctamente", null, 3000);
            this.verTramites(trabajador_id);
          },
          responsError =>{
            console.log(responsError);
            this.sharedService.showSnackBar(responsError.error, null, 3000);
          }
        );
      }
    });
    
  }

  verTramites(trabajador_id)
  {
    this.trabajadorService.getTramites(trabajador_id).subscribe(
      response => {
        //console.log(response);
        this.dataTramites = response;
      },
      responsError =>{
        this.sharedService.showSnackBar("Error al cargar los tramites del trabajador", null, 3000);
      }
    );
  }


  OficioSolicitud(id)
  {
    this.disabledDownload = true;
    this.trabajadorService.createFileComision(id).subscribe(
      response =>{
        
        if(response.error) {
          
          this.isLoading = false;
          //this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
            console.log(response);
            //return;
            const reportWorker = new ReportWorker();
            reportWorker.onmessage().subscribe(
              data => {
                FileSaver.saveAs(data.data,'ConstanciaComisión');
                reportWorker.terminate();
            });

            reportWorker.onerror().subscribe(
              (data) => {
                reportWorker.terminate();
              }
            );
            
            let config = {
              //title: this.reportTitle,
              //showSigns: this.reportIncludeSigns, 
            };

            reportWorker.postMessage({data:response,reporte:'archivo/solicitudComision'});
        }
        this.isLoading = false;
        this.disabledDownload = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        
        this.isLoading = false;
        this.disabledDownload = false;
        
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm():void {
    this.dialogRef.close(true);
  }
}