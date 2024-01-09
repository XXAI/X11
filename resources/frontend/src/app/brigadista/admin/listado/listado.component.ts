import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';

import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';

import { MediaObserver } from '@angular/flex-layout';
import { ServicioService } from '../../servicio.service';

import { ReportWorker } from '../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { RegistroGeneralComponent } from '../registro-general/registro-general.component';
import { RegistroParticularComponent } from '../registro-particular/registro-particular.component';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
  animations: [
    trigger('buttonInOut', [
        transition('void => *', [
            style({opacity: '1'}),
            animate(200)
        ]),
        transition('* => void', [
            animate(200, style({opacity: '0'}))
        ])
    ])
  ],
})
export class ListadoComponent implements OnInit {

  mediaSize: string;
  isLoading:boolean;
  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  paginas:any[] = [];
  
  filterCatalogs:any = {};
  filteredCatalogs:any = {};

  total_brigadistas:number = 0;
  total_vacuandores:number = 0;
  total_dengue:number = 0;
  total_general:number = 0;

  monto_brigadistas:number = 5000;
  monto_vacuandores:number = 9000;
  monto_dengue:number = 8000;
  
  filterChips:any = []; 

  displayedColumns: string[] = ['descripcion','datos','fecha', 'creacion', 'actions']; //'Agente',
  dataSource: any = [];

  constructor(private sharedService: SharedService, 
              public dialog: MatDialog, 
              private servicioService: ServicioService, 
              private fb: FormBuilder, 
              public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit(): void {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    
    if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if(appStoredData['paginator']){
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if(event.selectedIndex >= 0){
        this.selectedItemIndex = event.selectedIndex;
      }
    }else{
      let dummyPaginator = {
        length: 0,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        previousPageIndex: (this.currentPage > 0)?this.currentPage-1:0
       };
      this.sharedService.setDataToCurrentApp('paginator', dummyPaginator);
    }

    if(appStoredData['filter']){
      //this.filterForm.patchValue(appStoredData['filter']);
    }

    this.loadData(event);
    //this.loadFilterCatalogs();
  }

  public loadFilterCatalogs(){
    /*this.comisionService.getFilterCatalogs().subscribe(
      response => {
        //console.log(response);
        this.filterCatalogs = {
          'distrito': this.catalogoDistritos,
          'clues': response.data.clues,
          'cr': response.data.cr,
          'imprimible': [{id:'0',descripcion:'TODOS'},{id:'1',descripcion:'SI'},{id:'2',descripcion:'NO'}],
        };

        this.filteredCatalogs['clues'] = this.filterForm.controls['clues'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','nombre_unidad')));
        this.filteredCatalogs['cr'] = this.filterForm.controls['cr'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'cr','descripcion')));

        
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );*/
  }

  public loadData(event?:PageEvent){
    
    this.isLoading = true;
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
    
    params.query = this.searchQuery;

    /*let filterFormValues = this.filterForm.value;
    let countFilter = 0;

    //this.loadFilterChips(filterFormValues);

    for(let i in filterFormValues){
      
      if(filterFormValues[i]){
        if(i == 'distrito'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'clues'){
          params[i] = filterFormValues[i].clues;
        }else if(i == 'cr'){
          params[i] = filterFormValues[i].cr;
        }else if(i == 'imprimible'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'reingenieria'){
          
          params[i] = filterFormValues[i];
        }else if(i == 'fechaCreacion'){
          let fecha = this.convertDate(filterFormValues[i]);
          params[i] = fecha;
        }else{ //profesion y rama (grupos)
          params[i] = filterFormValues[i].id;
        }
        countFilter++;
      }
    }
    if(countFilter > 0){
      params.active_filter = true;
    }*/

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

    this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    //this.sharedService.setDataToCurrentApp('filter',filterFormValues);

    this.isLoading = false;
    this.servicioService.getListado(params).subscribe(
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
        this.isLoading = false;

        let totales = response.totales[0];
        this.total_brigadistas = totales.total_brigadista;
        this.total_vacuandores = totales.total_vacunador;
        this.total_dengue = totales.total_dengue;

        this.total_general = (this.total_brigadistas * this.monto_brigadistas) + (this.total_vacuandores * this.monto_vacuandores) + (this.total_dengue * this.monto_dengue);
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }

  eliminar(obj)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Eliminar',dialogMessage:'¿Realmente desea eliminar el registro? Escriba ELIMINAR a continuación para realizar el proceso.',validationString:'ELIMINAR',btnColor:'primary',btnText:'Eliminar'}
    });
    this.isLoading = true;
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.servicioService.eliminarBrigadista(obj.id,{}).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadData();
            }
            this.isLoading = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }else
      {
        this.isLoading = false;
      }
    });
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


  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-')
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  applyFilter(){
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadData(null);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  cleanFilter(filter){
    filter.value = '';
    //filter.closePanel();
  }

  compareImprimibleSelect(op,value){
    return op.id == value.id;
  }

  public Agregar(obj = null) {

    //console.log(obj);
    let configDialog = {};
    let row: any = {};
    if(obj != null)
    {
      row ={
        id: obj.id 
      };

    }
          
   configDialog = {
        width: '80%',
        maxHeight: '90vh',
        height: '620px',
        data: row
    }
    
    const dialogRef = this.dialog.open(RegistroGeneralComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      this.loadData();
    });
  }

  Subproceso(obj)
  {
    let configDialog = {};
    let row: any = {};
    if(obj != null)
    {
      row ={
        id: obj.id,
        descripcion: obj.descripcion 
      };

    }
          
   configDialog = {
        width: '80%',
        maxHeight: '90vh',
        height: '700px',
        data: row
    }
    
    const dialogRef = this.dialog.open(RegistroParticularComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      this.loadData();
    });
    
  }
  
}
