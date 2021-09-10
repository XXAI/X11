import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';

import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { TramitesService } from '../tramites.service';
import { DocumentacionImportacionDialogComponent } from '../documentacion-importacion-dialog/documentacion-importacion-dialog.component';

import { PermissionsList } from '../../auth/models/permissions-list';
import { IfHasPermissionDirective } from 'src/app/shared/if-has-permission.directive';
import { MediaObserver } from '@angular/flex-layout';

import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css'],
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
export class DocumentacionComponent implements OnInit {

  isLoading: boolean = false;
  isLoadingExcel: boolean = false;
  isLoadingPDF: boolean = false;
  isLoadingPDFArea: boolean = false;
  isLoadingAgent: boolean = false;
  mediaSize: string;

  puedeFinalizar: boolean = false;
  capturaFinalizada: boolean = false;
  countPersonalActivo: number = 0;
  countPersonalValidado: number = 0;
  percentPersonalValidado: number = 0;

  showMyStepper:boolean = false;
  showReportForm:boolean = false;
  stepperConfig:any = {};
  reportTitle:string;
  reportIncludeSigns:boolean = false;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  statusIcon:any = {
    '1':'remove_circle', //inactivo
    '2':'person_remove', //activo verificado 
    '3':'block', //baja
    //'3':'warning', // No identificado
    //'4':'swap_horizontal_circle' //en transferencia
  };

  validateIcon:any = {
    '0':'check', //no validado
    '1':'check_circle', //validado 
  };

  

  filterCatalogs:any = {};
  filteredCatalogs:any = {};

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}

  filterForm = this.fb.group({
    'clues': [undefined],
    'cr': [undefined],
    'estatus': [undefined],
    'comisionado': [undefined],
    'e4': [undefined],
    'rama': [undefined],
    'grupos': [undefined],
    'adscripcion': [undefined],
  });

  displayedColumns: string[] = ['estatus','RFC','CURP','Nombre', 'CR','actions']; //'Agente',
  dataSource: any = [];

  constructor(private sharedService: SharedService, public tramitesService: TramitesService, public dialog: MatDialog, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

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
        //console.log(event);
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
      this.filterForm.patchValue(appStoredData['filter']);
    }

    this.loadTrabajadorData(event);
    this.loadFilterCatalogs();
  }

  
  public CargarDocumento(obj)
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, id: obj.id, rfc: obj.rfc}
      };
    }else{
      configDialog = {
        width: '25%',
        data:{ id: obj.id, rfc: obj.rfc}
      }
    }
    const dialogRef = this.dialog.open(DocumentacionImportacionDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log(valid);
      }
      this.loadTrabajadorData();
    });
  }
  public loadFilterCatalogs(){
    this.tramitesService.getFilterCatalogs().subscribe(
      response => {
        //console.log(response);
        this.filterCatalogs = {
          'clues': response.data.clues,
          'cr': response.data.cr,
          'estatus': response.data.estatus,
          'rama': response.data.rama,
          'adscripcion': [{id:'MU',descripcion:'Adscrito y Fisico en la unidad'},{id:'OU', descripcion:'Comisionados de otras unidades'},{id:'EOU', descripcion:'Comisionados a otras unidades'}]
        };

        this.filteredCatalogs['clues'] = this.filterForm.controls['clues'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','nombre_unidad')));
        this.filteredCatalogs['cr'] = this.filterForm.controls['cr'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'cr','descripcion')));

        if(response.data.grupos){
          this.filterCatalogs.grupos = response.data.grupos;
          this.filteredCatalogs['grupos'] = this.filterForm.controls['grupos'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'grupos','descripcion')));
        }
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );
  }


  

  public loadTrabajadorData(event?:PageEvent){
    
    this.isLoading = false;
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

    let filterFormValues = this.filterForm.value;
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for(let i in filterFormValues){
      if(filterFormValues[i]){
        if(i == 'clues'){
          params[i] = filterFormValues[i].clues;
        }else if(i == 'cr'){
          params[i] = filterFormValues[i].cr;
        }else if(i == 'comisionado'){
          params[i] = filterFormValues[i];
        }else if(i == 'e4'){
          params[i] = filterFormValues[i];
        }else{ //profesion y rama (grupos)
          params[i] = filterFormValues[i].id;
        }
        countFilter++;
      }
    }

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

    this.tramitesService.getTramitesDocumentacionList(params).subscribe(
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
          if(event){
            event.length = this.resultsLength;
            this.sharedService.setDataToCurrentApp('paginator',event);
          }else{
            dummyPaginator.length = this.resultsLength;
            this.sharedService.setDataToCurrentApp('paginator',dummyPaginator);
          }
          
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

  loadFilterChips(data){
    this.filterChips = [];
    for(let i in data){
      if(data[i]){
        let item = {
          id: i,
          tag: '',
          tooltip: i.toUpperCase() + ': ',
          active: true
        };
        if(i == 'clues'){
          item.tag = data[i].clues;
          item.tooltip += data[i].nombre_unidad;
        }else if(i == 'cr'){
          item.tag = data[i].cr;
          item.tooltip += data[i].descripcion;
        }else if(i == 'comisionado'){
          item.tag = data[i].comisionado;
        }else if(i == 'e4'){
          item.tag = data[i].e4;
        }else{
          if(data[i].descripcion.length > 30){
            item.tag = data[i].descripcion.slice(0,20) + '...';
            item.tooltip += data[i].descripcion;
          }else{
            item.tag = data[i].descripcion;
            item.tooltip = i.toUpperCase();
          }
        }
        this.filterChips.push(item);
      }
    }
  }

  showAddEmployeDialog(){
    
  }

  editTrabajador(index){
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    paginator.selectedIndex = index;
    this.sharedService.setDataToCurrentApp('paginator',paginator);
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
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
  }

  applyFilter(){
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadTrabajadorData(null);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  cleanFilter(filter){
    filter.value = '';
    //filter.closePanel();
  }

  compareRamaSelect(op,value){
    return op.id == value.id;
  }

  compareEstatusSelect(op,value){
    return op.id == value.id;
  }

  compareAdscripcionSelect(op,value){
    return op.id == value.id;
  }
  compareComisionSelect(op,value)
  {
      op.id = value;
  }
  comparee4Select(op,value)
  {
      op.id = value;
  }

  solicitar(valor:number, trabajador_id:string)
  {
    /*this.trabajadorService.setTramite(valor, trabajador_id).subscribe(
      response => {
        console.log(response);
        this.sharedService.showSnackBar("Se guardo correctamente", null, 3000);
        this.OficioSolicitud(response.id);
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar(responsError.error, null, 3000);
      }
    );*/
  }

  OficioSolicitud(id)
  {
    /*this.trabajadorService.createFileComision(id).subscribe(
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

        this.isLoading = false;
        
      });*/
  }
}
