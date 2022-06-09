import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';

import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

import { MediaObserver } from '@angular/flex-layout';
import { ComisionSindicalService } from '../comision-sindical.service';

import { ReportWorker } from '../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

import { AgregarDialogComponent } from '../agregar-dialog/agregar-dialog.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
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
export class ListaComponent implements OnInit {

  isLoading: boolean = false;
  mediaSize: string;

  searchQuery: string = '';
  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  paginas:any[] = [];

  displayedColumns: string[] = ['nombre','clues','sindicato', 'actions']; //'Agente',
  dataSource: any = [];

  constructor(private sharedService: SharedService, public dialog: MatDialog, private comisionSindicalService: ComisionSindicalService, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit(): void {
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

    let filterFormValues = [];//this.filterForm.value;
    let countFilter = 0;

    /*for(let i in filterFormValues){
      if(filterFormValues[i]){
        if(i == 'distrito'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'clues'){
          params[i] = filterFormValues[i].clues;
        }else if(i == 'cr'){
          params[i] = filterFormValues[i].cr;
        }else if(i == 'imprimible'){
          params[i] = filterFormValues[i].id;
        }else{ //profesion y rama (grupos)
          params[i] = filterFormValues[i].id;
        }
        countFilter++;
      }
    }*/

    if(countFilter > 0){
      params.active_filter = true;
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

    this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    this.sharedService.setDataToCurrentApp('filter',filterFormValues);

    
    this.comisionSindicalService.getListPrincipal(params).subscribe(
      response =>{
          this.dataSource = [];
          this.resultsLength = 0;
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
    return event;
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  toggleAdvancedFilter(status){
    if(status){
      this.advancedFilter.open();
    }else{
      this.advancedFilter.close();
    }
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    /*let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));*/
    return [];
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

  

  
  public eliminar(obj)
  {
    let nombre =obj.nombre+" "+obj.apellido_paterno+" "+obj.apellido_materno;
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea eliminar la comisión de '+nombre+'? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.comisionSindicalService.eliminar(obj.id,{}).subscribe(
          response =>{
            this.sharedService.showSnackBar("SE HA ELIMINADO CORRECTAMENTE EL REGISTRO", null, 3000);
            this.isLoading = false;
            this.loadData();
          },
          errorResponse =>{
            this.sharedService.showSnackBar("OCURRIO UN ERROR, POR FAVOR VUELVA A INTENTARLO", null, 3000);
            //this.error_api(errorResponse);
          }
        );
      }
    });
  }

  public Agregar(obj = null) {

    //console.log(obj);
    let configDialog = {};
    let row: any = {};
    if(obj != null)
    {
      row ={
        id: obj.rel_trabajador_adscripcion.id, 
        trabajador: obj, 
        fecha_oficio:obj.rel_trabajador_adscripcion.fecha_oficio, 
        fecha_cambio: obj.rel_trabajador_adscripcion.fecha_cambio, 
        clues: obj.rel_trabajador_adscripcion.cr_destino,
        clues_adscripcion: obj.rel_datos_laborales_nomina.cr,
        catalogo_cr: 1//this.filterCatalogs['cr']
      };

    }else{
      row ={
        catalogo_cr: 1//this.filterCatalogs['cr']
      };
    }        

    if (this.mediaSize == 'lg') {
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '91vh',
        height: '620px',
        width: '100%',
        data: row
      }
    } else if (this.mediaSize == "md") {
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data: row
      }
    } else if (this.mediaSize == 'xs') {
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '60vh',
        height: '72%',
        width: '100%',
        data: row
      };
    } else {
      configDialog = {
        width: '60%',
        maxHeight: '60vh',
        height: '400px',
        data: row
      }
    }
    
    const dialogRef = this.dialog.open(AgregarDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      //this.loadRegistroData();
    });
  }
}
