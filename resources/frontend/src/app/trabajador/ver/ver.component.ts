import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TrabajadorService } from '../trabajador.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';

export interface VerEmpleadoData {
  id: number;
  puedeEditar?:boolean;
  cluesAsistencia?:any;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<VerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerEmpleadoData,
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService,
    private sharedService: SharedService
  ) { }

  dataTrabajador: any;

  cluesAsistencia = []; //= [ 'CSSSA017213', 'CSSSA009162', 'CSSSA019954', 'CSSSA017324' ];

  datosCredencial:any;
  photoPlaceholder = 'assets/profile-icon.svg';
  Asitencia:boolean = false;
  url           = `${environment.base_url_file}`;

  puedeVerAsistencias: boolean = false;
  puedeEditar:boolean = false;
  dataSource = [];
  dataTramites = [];//[{tramite:'COMISIÓN', periodo:'---', acuse:'---', estatus:1}];
  displayedColumns: string[] = ['institucion','grado','descripcion','cedula']; //'Agente',
  displayedColumnsTramite: string[] = ['tramite','periodo', 'archivo', 'estatus']; //'Agente',
  estatusDocumentacion:string[] = ['', 'En revisión', "En corrección", "Validado"];
  navTabSelected:number = 0;
  pestanaTramites:boolean = false;

  verInfoExpediente:boolean = true;

  //Para el listado de las asistencias
  isLoadingAsistencia:boolean = false;
  asistenciasCargadas:boolean = false;
  verifData:any;
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
    /*if(userPermissions['NZlDkhi8ikVhdgfT8zVVIGroFNtHfIQe']){
      this.puedeVerAsistencias = true;
    }else{
      this.puedeVerAsistencias = false;
    }*/
    this.cluesAsistencia = this.data.cluesAsistencia;
   
    if(this.data.puedeEditar){
      this.puedeEditar = this.data.puedeEditar;
    }
    
    this.loadDataTrabajador(this.data.id);
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
        //console.log("onde",response);
        this.dataTrabajador = response;
        //console.log(this.dataTrabajador);
        this.dataSource = this.dataTrabajador.escolaridad;
        //console.log(this.dataTrabajador);
        this.verTramites(response.id);
        this.Asitencia = (response.actualizado == 0)?false:true;
        //console.log(this.Asitencia);
        
        if(this.dataTrabajador.rel_trabajador_documentos != null)
        {
          this.verInfoExpediente = false;
        }

        if(this.verificarAsistencia(this.dataTrabajador.rel_datos_laborales.cr_fisico.clues))
        {
          if(this.dataTrabajador.rel_datos_comision == null)
          {
            this.puedeVerAsistencias = true;
          }
        }
    
        if(this.dataTrabajador.rel_datos_laborales_nomina)
        {
          if(this.dataTrabajador.rel_datos_laborales.cr_fisico_id != this.dataTrabajador.rel_datos_laborales_nomina.cr_nomina_id)
          {
            if(this.dataTrabajador.rel_datos_laborales_nomina.ur !='610'  && this.dataTrabajador.rel_datos_comision == null)
            {
              this.pestanaTramites = true;
            }
            
          }
        }
        //console.log(this.dataTrabajador.rel_datos_laborales.cr_fisico_id +" - "+ this.dataTrabajador.rel_datos_laborales_nomina.cr_nomina_id);
        //console.log(this.pestanaTramites);
        
        if(this.dataTrabajador.clave_credencial){
          this.trabajadorService.getDatosCredencial(this.dataTrabajador.clave_credencial).subscribe(
            response => {
              //console.log(response);
              if(response.length > 0){
                this.datosCredencial = response[0];
                if(this.datosCredencial.tieneFoto == '1'){
                  this.datosCredencial.photo = 'http://credencializacion.saludchiapas.gob.mx/images/credenciales/'+this.datosCredencial.id+'.'+this.datosCredencial.tipoFoto;
                }else{
                  this.datosCredencial.photo = this.photoPlaceholder;
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
        }

        this.isLoading = false;
      });
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


  verExpediente(obj:any)
  {
    if(!this.verInfoExpediente)
    {
      window.open(this.url+`\\documentacion\\`+obj.rfc+`.pdf`, "_blank");
    }else{
      this.sharedService.showSnackBar('No tiene expediente registrado', null, 4000);
    }
    
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
    
    if(event.index == 2 && this.puedeVerAsistencias){
      console.log('corriendo listado de asistencia');
      this.cargarAssistencias(this.dataTrabajador.clave_credencial);
    }
  }

  buscarFechasAssitencia(){
    let fecha_inicio = this.fechaInicioAsist.toISOString().slice(0,10);
    let fecha_fin = this.fechaFinAsist.toISOString().slice(0,10);
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
    }

    this.isLoadingAsistencia = true;
    this.assistSource = [];
    this.verifData = undefined;

    this.trabajadorService.getDatosAsistencia(payload).subscribe(
      response => {
        //console.log(response);
        let conversionAsistencia = [];

        for(let i in response.data){
          conversionAsistencia.push(response.data[i]);
        }
        this.assistSource = conversionAsistencia;
        
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
        this.asistenciasCargadas = true;
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );
  }

  reporteAsistencias(){
    this.isLoadingPDF = true;
    const reportWorker = new ReportWorker();
    reportWorker.onmessage().subscribe(
      data => {
        console.log(data);
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
    //console.log(reportData);
    //console.log(reportData);
    reportWorker.postMessage({data:{items: this.assistSource, data: reportData },reporte:'empleados/personal-asistencia'});
  }

  solicitar(valor:number, trabajador_id:string)
  {
    //console.log(valor+" - "+trabajador_id);
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
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        //this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        //this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
        
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm():void {
    this.dialogRef.close(true);
  }
}