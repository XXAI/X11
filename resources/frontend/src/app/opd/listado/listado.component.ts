import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';

import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';

import { MediaObserver } from '@angular/flex-layout';
import { ServicioService } from '../servicio.service';

import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

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
  ]
})
export class ListadoComponent implements OnInit {
  isLoading: boolean = false;
  isLoadingPDF: boolean = false;
  isLoadingPDFArea: boolean = false;
  mediaSize: string;

  
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
  displayedColumns: string[] = ['clues', 'nombre_unidad', 'municipio', 'vialidad', 'responsable', 'anexo_1', 'anexo_3','actions']; //'Agente',
  dataSource: any = [];

  constructor(private sharedService: SharedService, private servicioService: ServicioService, public dialog: MatDialog, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit(): void {
    this.loadData();
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  reporte()
  {}

  public loadData(event?:PageEvent)
  {
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

    let countFilter = 0;

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

    this.servicioService.getList(params).subscribe(
      response =>{

          this.dataSource = [];
          this.resultsLength = 0;
          //this.llenarPaginasLote(response.data.total);
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

          //this.permisoImpresion = response.impresion;
          
        //}
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

  applyFilter(){
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadData(null);
  }

  imprimirFormato(obj:any = null, lote:number = null)
  {
    this.toggleReportPanel();
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;
    this.stepperConfig.steps[0].status = 2;

    if(obj == null)
    {
      let params:any = {};
      let countFilter = 0;

      let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
      params.reporte = 'formato';
      
      this.servicioService.imprimirLote((lote + 1), params).subscribe(
        response =>{
          if(response.error) {
            this.error_pdf(response);
          } else {    
            //console.log(response);
            this.loadData();
             const reportWorker = this.iniciateWorker('FormatoHola');
              let config = {  title: this.reportTitle, lote:true };
              reportWorker.postMessage({data:{items: response.data, config:config, formato: response.formato},reporte:'opd/formato'});
          }
          this.isLoading = false;
        },
        errorResponse =>{
          this.error_api(errorResponse);
        });
    }else{
      this.servicioService.buscarRegistro(obj.id,{}).subscribe(
        response =>{
          if(response.error) {
            this.error_pdf(response);
          } else {    
              this.GuardarRegistroAnexos(obj.id, 1);
              const reportWorker = this.iniciateWorker('ACTA_'+response.data.nombre_unidad.replace(" ","_"));
              let config = {  title: this.reportTitle, lote:false };
              reportWorker.postMessage({data:{items: response.data, config:config, formato: response.formato},reporte:'opd/formato'});
          }
          this.isLoading = false;
        },
        errorResponse =>{
          this.error_api(errorResponse);
        }
      );
    }
  }

  GuardarRegistroAnexos(id ,tipo)
  {
    this.servicioService.RegistroImpresionAnexos(id,{params: tipo}).subscribe(
      response =>{
        if(response.error) {
          this.error_pdf(response);
        } else {    
          this.loadData();
        }
        this.isLoading = false;
      },
      errorResponse =>{
        this.error_api(errorResponse);
      }
    );
  }

  toggleReportPanel(){
    this.reportIncludeSigns = false;
    this.reportTitle = 'Listado de Personal Activo';

    this.stepperConfig = {
      steps:[
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Cargar Datos', active: 'Cargando Datos', done: 'Datos Cargados' },
          icon: 'settings_remote',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Generar PDF', active: 'Generando PDF', done: 'PDF Generado' },
          icon: 'settings_applications',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Descargar Archivo', active: 'Descargando Archivo', done: 'Archivo Descargado' },
          icon: 'save_alt',
          errorMessage: '',
        },
      ],
      currentIndex: 0
    }

    this.showReportForm = !this.showReportForm;
    if(this.showReportForm){
      this.showMyStepper = false;
    }
    //this.showMyStepper = !this.showMyStepper;
  }

  error_pdf(obj:any)
  {
    console.log(obj);
    let errorMessage = obj.error.message;
    this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
    this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
    this.isLoading = false;
  }

  error_api(obj:any)
  {
    console.log(obj);
    var errorMessage = "Ocurrió un error.";
    if(obj.status == 409){
      errorMessage = obj.error.error.message;
    }
    this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
    this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
    this.isLoading = false;
  }

  iniciateWorker(nombre:string)
  {
      this.stepperConfig.steps[0].status = 3;
      this.stepperConfig.steps[1].status = 2;
      this.stepperConfig.currentIndex = 1;

      const reportWorker = new ReportWorker();
      reportWorker.onmessage().subscribe(
        data => {
          this.stepperConfig.steps[1].status = 3;
          this.stepperConfig.steps[2].status = 2;
          this.stepperConfig.currentIndex = 2;

          FileSaver.saveAs(data.data,nombre);
          reportWorker.terminate();

          this.stepperConfig.steps[2].status = 3;
          this.isLoadingPDF = false;
          this.showMyStepper = false;
      });

      reportWorker.onerror().subscribe(
        (data) => {
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
          this.isLoadingPDF = false;
          //console.log(data.message);
          reportWorker.terminate();
        }
      );
      return reportWorker;
  }

}
