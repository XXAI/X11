import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmpleadosService } from '../empleados.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

export interface VerEmpleadoData {
  id: number;
  puedeEditar?:boolean;
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
    private empleadosService: EmpleadosService,
    private sharedService: SharedService
  ) { }

  dataEmpleado: any;

  datosCredencial:any;
  photoPlaceholder = 'assets/profile-icon.svg';

  puedeVerAsistencias: boolean = false;
  puedeEditar:boolean = false;

  navTabSelected:number = 0;

  //Para el listado de las asistencias
  isLoadingAsistencia:boolean = false;
  asistenciasCargadas:boolean = false;
  verifData:any;
  fechaInicioAsist: any;
  fechaFinAsist: any;
  displayedScheduleColumns: string[] = ['dia','fecha','hora_entrada','hora_salida','justificado'];
  assistSource: any = [];
  resumenAsistencias: any;
  daysLabels: any = {
    1:"LUNES", 
    2:"MARTES", 
    3:"MIERCOLES", 
    4:"JUEVES", 
    5:"VIERNES", 
    6:"SABADO", 
    7:"DOMINGO"
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
    if(userPermissions['NZlDkhi8ikVhdgfT8zVVIGroFNtHfIQe']){
      this.puedeVerAsistencias = true;
    }else{
      this.puedeVerAsistencias = false;
    }

    if(this.data.puedeEditar){
      this.puedeEditar = this.data.puedeEditar;
    }
    
    this.loadDataEmpleado(this.data.id);
  }

  loadDataEmpleado(id:any){
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

    this.empleadosService.verInfoEmpleado(id,params).subscribe(
      response =>{
        console.log(response);
        this.dataEmpleado = response.data;

        if(this.dataEmpleado.figf){
          this.dataEmpleado.figf = new Date(this.dataEmpleado.figf.substring(0,4),(this.dataEmpleado.figf.substring(5,7)-1), this.dataEmpleado.figf.substring(8,10),12,0,0,0);
        }

        if(this.dataEmpleado.fissa){
          this.dataEmpleado.fissa = new Date(this.dataEmpleado.fissa.substring(0,4),(this.dataEmpleado.fissa.substring(5,7)-1), this.dataEmpleado.fissa.substring(8,10),12,0,0,0);
        }

        if(this.dataEmpleado.hora_entrada){
          this.dataEmpleado.hora_entrada = new Date(1,1,1,this.dataEmpleado.hora_entrada.substring(0,2),(this.dataEmpleado.hora_entrada.substring(3,5)),0,0);
        }
        
        if(this.dataEmpleado.hora_salida){
          this.dataEmpleado.hora_salida = new Date(1,1,1,this.dataEmpleado.hora_salida.substring(0,2),(this.dataEmpleado.hora_salida.substring(3,5)),0,0);
        }

        if(this.dataEmpleado.tipo_comision == 'CI'){
          this.dataEmpleado.comision = 'Comisión Interna';
        }else if(this.dataEmpleado.tipo_comision == 'CS'){
          this.dataEmpleado.comision = 'Comisión Sindical';
        }else if(this.dataEmpleado.tipo_comision == 'LH'){
          this.dataEmpleado.comision = 'Licencia Humanitaria';
        }

        if(response.pagination){
          let paginator = this.sharedService.getDataFromCurrentApp('paginator');

          let paginationIndex = response.pagination.next_prev.findIndex(item => item.id == this.dataEmpleado.id);
          //Aqui verificar estatus
          if(paginationIndex < 0){
            this.miniPagination.next = (response.pagination.next_prev[1])?response.pagination.next_prev[1].id:0;
            this.miniPagination.previous = (response.pagination.next_prev[0])?response.pagination.next_prev[0].id:0;
          }else{
            this.miniPagination.next = (response.pagination.next_prev[paginationIndex+1])?response.pagination.next_prev[paginationIndex+1].id:0;
            this.miniPagination.previous = (response.pagination.next_prev[paginationIndex-1])?response.pagination.next_prev[paginationIndex-1].id:0;
          }
          
          this.miniPagination.total = response.pagination.total;
          this.miniPagination.current = (paginator.pageSize*paginator.pageIndex)+paginator.selectedIndex+1;
        }else{
          this.miniPagination.total = 0;
        }

        if(this.dataEmpleado.clave_credencial){
          this.empleadosService.getDatosCredencial(this.dataEmpleado.clave_credencial).subscribe(
            response => {
              console.log(response);
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

        if(this.navTabSelected == 2){
          this.asistenciasCargadas = false;
          this.cargarAssistencias(this.dataEmpleado.clave_credencial);
        }else{
          this.assistSource = [];
          this.asistenciasCargadas = false;
        }

        this.isLoading = false;
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
    this.loadDataEmpleado(nextId);
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
    this.loadDataEmpleado(prevId);
  }

  editarEmpleado(){
    this.dialogRef.close();
    this.router.navigate(['/empleados/editar/'+this.dataEmpleado.id]);
  }

  dataTabChange(event){
    if(event.index == 2 && !this.asistenciasCargadas){
      console.log('corriendo listado de asistencia');
      this.cargarAssistencias(this.dataEmpleado.clave_credencial);
    }
  }

  buscarFechasAssitencia(){
    let fecha_inicio = this.fechaInicioAsist.toISOString().slice(0,10);
    let fecha_fin = this.fechaFinAsist.toISOString().slice(0,10);
    this.cargarAssistencias(this.dataEmpleado.clave_credencial, fecha_inicio, fecha_fin);
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

    this.empleadosService.getDatosAsistencia(payload).subscribe(
      response => {
        console.log(response);
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

    switch (this.dataEmpleado.estatus) {
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

    let reportData = {
      fecha_inicial: this.fechaInicioAsist.toISOString().substring(0,10),
      fecha_final: this.fechaFinAsist.toISOString().substring(0,10),
      nombre: this.dataEmpleado.apellido_paterno + ' ' + this.dataEmpleado.apellido_materno + ' ' + this.dataEmpleado.nombre,
      rfc: this.dataEmpleado.rfc,
      curp: this.dataEmpleado.curp,
      id: this.verifData.id,
      estatus: estatus_empleado,
      lugar:(this.dataEmpleado.cr)?this.dataEmpleado.cr.descripcion:'',
      turno:(this.dataEmpleado.turno)?this.dataEmpleado.turno.descripcion:'',
      horario:'de ' + this.dataEmpleado.hora_entrada.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + ' a ' + this.dataEmpleado.hora_salida.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      resumen: this.resumenAsistencias
    };
    
    console.log(reportData);
    reportWorker.postMessage({data:{items: this.assistSource, data: reportData },reporte:'empleados/personal-asistencia'});
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm():void {
    this.dialogRef.close(true);
  }
}