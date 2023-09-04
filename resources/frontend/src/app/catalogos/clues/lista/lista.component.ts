import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CluesService } from '../../clues.service';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  isLoading: boolean = false;
  
  showMyStepper:boolean = false;
  searchQuery: string = '';
  filtroAvanzado:boolean = true;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  catalogoDistritos: string[] = ['',
  'TUXTLA GUTIERREZ', 
  'SAN CRISTOBAL', 
  'COMITAN DE DOMINGUEZ', 
  'VILLAFLORES', 
  'PICHUCALCO',
  'PALENQUE',
  'TAPACHULA',
  'TONALA',
  'OCOSINGO',
  'MOTOZINTLA',
  'OFICINA CENTRAL'];
  displayedColumns: string[] = ['Clues', 'Nombre', 'Nivel', 'Estatus','actions'];
  dataSource: any = [];

  filterForm = this.fb.group({
    'relacionado': [undefined],
    'personal': [undefined],
    'distrito': [undefined],
    
  });

  constructor(private sharedService: SharedService, private cluesService: CluesService, public dialog: MatDialog, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit() {
    this.loadCluesData(null);
  }

  public loadCluesData(event?:PageEvent){
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

    this.cluesService.getCluesList(params).subscribe(
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

  eliminar(id:any)
  {
    console.log(id);
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea eliminar este registro? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoading = true;
        this.cluesService.delUnidad(id).subscribe(
          response =>{
            this.loadCluesData();
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
      }
    });
    
  }

  toggleAdvancedFilter(status){
    if(status){
      this.filtroAvanzado = !this.filtroAvanzado;
      this.advancedFilter.open();
    }else{
      this.filtroAvanzado = !this.filtroAvanzado;
      this.advancedFilter.close();
    }
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  applyFilter(){
    /*this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadEmpleadosData(null);*/
    this.loadCluesData();
  }
}
