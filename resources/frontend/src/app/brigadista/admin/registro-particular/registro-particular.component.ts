import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioService } from '../../servicio.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { MatTable } from '@angular/material/table';

export interface DatosBrigadista {
  id: number;
  descripcion: string;
}

@Component({
  selector: 'app-registro-particular',
  templateUrl: './registro-particular.component.html',
  styleUrls: ['./registro-particular.component.css']
})
export class RegistroParticularComponent implements OnInit {

  nombre_proceso:string = "";

  meses: string[] = ['','ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']; //'Agente',
  displayedColumns: string[] = ['descripcion','mes', 'brigadista', 'vacunador','dengue', 'creacion', 'actions']; //'Agente',
  dataSource: any = [];
  isLoadingData:boolean = false;
  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;
  paginas:any[] = [];
  selected = new FormControl(0);
  id_edicion:number = 0;

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegistroParticularComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosBrigadista,
    private servicioService: ServicioService,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;

  public RegistroForm = this.fb.group({
    'id':[''],
    'brigadista_id':[''],
    'descripcion':['',Validators.required],
    //'anio':['',Validators.required],
    'brigadista_generalizar':[''],
    'vacunacion_generalizar':[''],
    'dengue_generalizar':[''],

    'brigadista_1':[''],
    'vacunacion_1':[''],
    'dengue_1':[''],
    
    'brigadista_2':[''],
    'vacunacion_2':[''],
    'dengue_2':[''],
    
    'brigadista_3':[''],
    'vacunacion_3':[''],
    'dengue_3':[''],
    
    'brigadista_4':[''],
    'vacunacion_4':[''],
    'dengue_4':[''],

    'brigadista_5':[''],
    'vacunacion_5':[''],
    'dengue_5':[''],
    
    'brigadista_6':[''],
    'vacunacion_6':[''],
    'dengue_6':[''],
    
    'brigadista_7':[''],
    'vacunacion_7':[''],
    'dengue_7':[''],
    
    'brigadista_8':[''],
    'vacunacion_8':[''],
    'dengue_8':[''],

    'brigadista_9':[''],
    'vacunacion_9':[''],
    'dengue_9':[''],
    
    'brigadista_10':[''],
    'vacunacion_10':[''],
    'dengue_10':[''],
    
    'brigadista_11':[''],
    'vacunacion_11':[''],
    'dengue_11':[''],
    
    'brigadista_12':[''],
    'vacunacion_12':[''],
    'dengue_12':[''],
    
  });

  ngOnInit(): void {
    this.nombre_proceso = this.data.descripcion;
    this.RegistroForm.patchValue({brigadista_id: this.data.id});
    this.CargarLista();
  }

  editar(obj)
  {
    this.id_edicion = obj.id;
    this.selected.setValue(2);
    //console.log(obj);
    this.RegistroForm.patchValue({descripcion: obj.descripcion, id: obj.id});
    this.servicioService.verSubBrigadista(obj.id).subscribe(
      response =>{
          //console.log(response);
          response.data.mes.forEach(element => {
            this.RegistroForm.get("brigadista_"+element.mes).patchValue(element.brigadista);
            this.RegistroForm.get("vacunacion_"+element.mes).patchValue(element.vacunador);
            this.RegistroForm.get("dengue_"+element.mes).patchValue(element.dengue);
          });
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoadingData = false;
      }
    );
  }

  CargarLista(event?:PageEvent){
    
    this.isLoadingData = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    if(event && !event.hasOwnProperty('selectedIndex')){
      this.selectedItemIndex = -1;
    }
    
    
    let dummyPaginator;
    if(event){
      this.sharedService.setDataToCurrentApp('paginator',event);
    }else{
      dummyPaginator = {
        length: 0,
        pageIndex: (this.paginator)?this.paginator.pageIndex:this.currentPage,
        pageSize: (this.paginator)?this.paginator.pageSize:this.pageSize,
        previousPageIndex: (this.paginator)?this.paginator.previousPage:((this.currentPage > 0)?this.currentPage-1:0)
      };
    }

    this.isLoadingData = false;
    this.servicioService.ListarSubProceso(params).subscribe(
      response =>{
          this.dataSource = [];
          this.resultsLength = 0;
          this.llenarPaginasLote(response.data.total);
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          }
          if(event){
            event.length = this.resultsLength;
            this.sharedService.setDataToCurrentApp('paginator',event);
          }else{
            dummyPaginator.length = this.resultsLength;
            this.sharedService.setDataToCurrentApp('paginator',dummyPaginator);
          }
        //}
        this.isLoadingData = false;

        /*let totales = response.totales[0];
        this.total_brigadistas = totales.total_brigadista;
        this.total_vacuandores = totales.total_vacunador;
        this.total_dengue = totales.total_dengue;

        this.total_general = (this.total_brigadistas * this.monto_brigadistas) + (this.total_vacuandores * this.monto_vacuandores) + (this.total_dengue * this.monto_dengue);*/
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoadingData = false;
      }
    );
    return event;
  }

  llenarPaginasLote(total)
  {
    let paginacion = Math.ceil(total / 50);
    this.paginas = [];
    let i:number = 1;
    for(i; i<= paginacion; i++)
    {
      this.paginas.push(1);
    }
  }

  generalizar()
  {
    let brigadista  = this.RegistroForm.get("brigadista_generalizar").value;
    let vacunacion  = this.RegistroForm.get("vacunacion_generalizar").value;
    let dengue      = this.RegistroForm.get("dengue_generalizar").value;
    for (let index = 1; index <= 12; index++) {
      this.RegistroForm.get("brigadista_"+index).patchValue(brigadista);
      this.RegistroForm.get("vacunacion_"+index).patchValue(vacunacion);
      this.RegistroForm.get("dengue_"+index).patchValue(dengue);
    }
  }

  cancelar()
  {
    this.dialogRef.close(true);
  }

 

  guardar()
  {
    if(this.id_edicion!=0)
    {
      this.servicioService.editarsubProceso(this.id_edicion, this.RegistroForm.value).subscribe(
        response =>{
          this.sharedService.showSnackBar("SE HA GUARDADO CORRECTAMENTE", null, 3000);
          this.selected.setValue(0);
          this.RegistroForm.reset();
          this.RegistroForm.patchValue({brigadista_id: this.data.id});
          this.CargarLista();
          this.id_edicion = 0;
        },
        errorResponse =>{
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        }
      );
    }else{
      this.servicioService.guardarsubProceso(this.RegistroForm.value).subscribe(
        response =>{
          this.sharedService.showSnackBar("SE HA GUARDADO CORRECTAMENTE", null, 3000);
          //this.cancelar();
          this.selected.setValue(0);
        },
        errorResponse =>{
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        }
      );
    }
    
  }

}
