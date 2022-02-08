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

import { PermissionsList } from '../../auth/models/permissions-list';
import { IfHasPermissionDirective } from 'src/app/shared/if-has-permission.directive';
import { MediaObserver } from '@angular/flex-layout';

import { TramitesService } from '../tramites.service';


import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

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
  resultsLengthRecepcion: number = 0;
  resultsLengthEnvio: number = 0;
  resultsLengthValidacion: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;
  permisoSistematizacion:boolean =false;
  permisoRh:boolean =false;

  displayedColumns: string[] = ['tramite', 'datos_tramite', 'acciones','estatus']; //'Agente',
  dataSourceRecepcion: any = [];
  dataSourceEnvio: any = [];
  dataSourceValidacion: any = [];
  disabledDownload:boolean = false;

  constructor(private sharedService: SharedService, private tramitesService: TramitesService, public dialog: MatDialog, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;


  ngOnInit(): void {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    //let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    
    /*if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }*/

    let event = null
    /*if(appStoredData['paginator']){
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
    }*/

    /*if(appStoredData['filter']){
      this.filterForm.patchValue(appStoredData['filter']);
    }*/

    this.loadTramitesData(event);
    //this.loadFilterCatalogs();
  }

  applyFilter(){
    /*this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;*/
    this.loadTramitesData(null);
  }

  clearFilter(){
    this.searchQuery = '';
  }

  loadTramitesData(event?:PageEvent){ 
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

    
    //this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    //this.sharedService.setDataToCurrentApp('filter',filterFormValues);

    this.tramitesService.getTramitesList(params).subscribe(
      response =>{
        //console.log(response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.dataSourceRecepcion = [];
          this.dataSourceEnvio = [];
          this.dataSourceValidacion = [];
          this.resultsLengthRecepcion = 0;
          console.log(response);
          this.permisoSistematizacion = response.rh_central;
          this.permisoRh = response.rh;
          console.log(this.permisoSistematizacion);
          this.dataSourceRecepcion = response.data_destino.data;
          this.dataSourceEnvio = response.data_origen.data;
          this.dataSourceValidacion = response.data_validacion.data;
            /*this.resultsLengthRecepcion = response.data_destino.total;
            this.resultsLengthEnvio = response.data_envio.total;
            this.resultsLengthValidacion = response.data_validacion.total;*/
          /*if(response.data.total > 0){
            this.dataSource = response.data.data;
            
            this.resultsLength = response.data.total;
          }*/
          /*if(event){
            event.length = this.resultsLength;
            this.sharedService.setDataToCurrentApp('paginator',event);
          }else{
            dummyPaginator.length = this.resultsLength;
            this.sharedService.setDataToCurrentApp('paginator',dummyPaginator);
          }*/
          
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

  cambioEstatus(id, tipo, estatus:number){ 
    this.isLoading = true;
    console.log(id, estatus);
    this.tramitesService.setTramiteEstatus(id, tipo, estatus).subscribe(
      response =>{
        //console.log(response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
         
          this.loadTramitesData();
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

  imprimirComprobante(id)
  {
    this.disabledDownload = true;
      this.tramitesService.createFileComision(id).subscribe(
        response =>{
          
          if(response.error) {
            
            this.isLoading = false;
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
              };   
              reportWorker.postMessage({data:response,reporte:'archivo/comision'});
          }
          //console.log(response);
          this.isLoading = false;
          this.disabledDownload = false;
        },
        errorResponse =>{
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          
          this.isLoading = false;
          this.disabledDownload = false;
          
        }
      );
  }
}
