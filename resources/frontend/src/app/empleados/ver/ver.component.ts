import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmpleadosService } from '../empleados.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { IfHasPermissionDirective } from 'src/app/shared/if-has-permission.directive';

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
  verifData:string;
  fechaInicioAsist: any;
  fechaFinAsist: any;
  displayedScheduleColumns: string[] = ['dia','fecha','hora_entrada','hora_salida','justificado'];
  assistSource: any = [];
  daysLabels: any = {
    1:"LUNES", 
    2:"MARTES", 
    3:"MIERCOLES", 
    4:"JUEVES", 
    5:"VIERNES", 
    6:"SABADO", 
    7:"DOMINGO"
  };


  isLoadingCredential:boolean = false;
  isLoading:boolean = false;

  ngOnInit() {
    let userPermissions = JSON.parse(localStorage.getItem('permissions'));
    if(userPermissions['NZlDkhi8ikVhdgfT8zVVIGroFNtHfIQe']){
      this.puedeVerAsistencias = true;
    }else{
      this.puedeVerAsistencias = false;
    }

    this.isLoadingCredential = true;
    this.isLoading = true;

    if(this.data.puedeEditar){
      this.puedeEditar = this.data.puedeEditar;
    }

    this.empleadosService.verInfoEmpleado(this.data.id).subscribe(
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

        this.isLoading = false;
      });
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
    this.verifData = '';

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

        this.verifData = 'ID: ' + response.validacion.Badgenumber + ' | Nombre: ' + response.validacion.Name + ' | RFC: ' + response.validacion.TITLE;
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

  cancel(): void {
    this.dialogRef.close();
  }

  confirm():void {
    this.dialogRef.close(true);
  }
}