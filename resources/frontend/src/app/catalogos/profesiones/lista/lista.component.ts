import { Component, OnInit } from '@angular/core';
import { ProfesionesService } from '../profesiones.service';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormularioComponent } from '../formulario/formulario.component';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  isLoading: boolean = false;
  
  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  mediaSize: string;

  displayedColumns: string[] = ['descripcion', 'tipo', 'rama','actions'];
  dataSource: any = [];

  constructor(private sharedService: SharedService, private profesionesService: ProfesionesService, public dialog: MatDialog, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  //@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  //@ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;

  ngOnInit() {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    this.loadProfesionesData();
  }

  public loadProfesionesData(event?:PageEvent){
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: 20 }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    params.query = this.searchQuery;

    this.profesionesService.obtenerListaProfesiones(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.dataSource = [];
          this.resultsLength = 0;
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          }
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }

  mostrarFormularioProfesion(id?:number){
    let configDialog:any;
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize}
      };
    }else{
      configDialog = {
        width: '95%',
        data:{}
      }
    }

    if(id){
      configDialog.data.id = id;
    }

    const dialogRef = this.dialog.open(FormularioComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadProfesionesData(this.pageEvent);
      }
    });
  }


  cleanSearch(){
    this.searchQuery = '';
  }

  applyFilter(){
    /*this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadEmpleadosData(null);*/
    this.loadProfesionesData();
  }

}
