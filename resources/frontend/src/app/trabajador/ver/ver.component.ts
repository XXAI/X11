import { Component, Inject, OnInit } from '@angular/core';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TrabajadorService } from '../trabajador.service';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

// export interface VerEmpleadoData {
//   id: number;
//   puedeEditar?:boolean;
// }

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    //public dialogRef: MatDialogRef<VerComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: VerEmpleadoData,
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService,
    private sharedService: SharedService
  ) { }

  dataTrabajador: any;

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
  //displayedScheduleColumns: string[] = ['dia','fecha','hora_entrada','hora_salida','justificado'];
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

  trabajador_id:number = 0;

  ngOnInit() {
    // let userPermissions = JSON.parse(localStorage.getItem('permissions'));
    // if(userPermissions['NZlDkhi8ikVhdgfT8zVVIGroFNtHfIQe']){
    //   this.puedeVerAsistencias = true;
    // }else{
    //   this.puedeVerAsistencias = false;
    // }

    // if(this.data.puedeEditar){
    //   this.puedeEditar = this.data.puedeEditar;
    // }
    
    // this.loadDataEmpleado(this.data.id);
    // console.log("asedasd");

    this.route.params.subscribe(params => {
      
      this.trabajador_id = params['id'];
      if(this.trabajador_id){
        this.loadDataEmpleado(this.trabajador_id);
      }
  });
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
    this.isLoading = true;
    this.trabajadorService.verInfoTrabajador(id,params).subscribe(
      response =>{
        console.log(response);
        this.dataTrabajador = response;

        console.log(this.dataTrabajador);

        this.isLoading = false;
      },
      errorResponse => {
        console.log(errorResponse);
        this.isLoading = false;
      });
  }

}