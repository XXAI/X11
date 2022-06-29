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
import { ComisionService } from '../comision.service';

import { ReportWorker } from '../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { FormularioComponent } from '../formulario/formulario.component';

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
  countPersonalActualizado:number = 0;
  percentPersonalActualizado:number = 0;
  cluesAsistencia = [];

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

  permisoImpresion:boolean = false;

  paginas:any[] = [];
  
  catalogoDistritos = [{id:0, descripcion:"TODOS"},
                        {id:1, descripcion:"TUXTLA GUTIERREZ"},
                        {id:2, descripcion:"SAN CRISTOBAL"},
                        {id:3, descripcion:"COMITAN DE DOMÍNGUEZ"},
                        {id:4, descripcion:"VILLAFLORES"},
                        {id:5, descripcion:"PICHUCALCO"},
                        {id:6, descripcion:"PALENQUE"},
                        {id:7, descripcion:"TAPACHULA"},
                        {id:8, descripcion:"TONALA"},
                        {id:9, descripcion:"OCOSINGO"},
                        {id:10, descripcion:"MOTOZINTLA"},
                        {id:11, descripcion:"OFICINA CENTRAL"}];

  statusIcon:any = {
    '1':'remove_circle', //inactivo
    '2':'person_remove', //activo verificado 
    '3':'block', //baja
  };

  validateIcon:any = {
    '0':'check', //no validado
    '1':'check_circle', //validado 
  };

  filterCatalogs:any = {};
  filteredCatalogs:any = {};


  filterChips:any = []; 

  filterForm = this.fb.group({
    'distrito': [undefined],
    'clues': [undefined],
    'cr': [undefined],
    'imprimible': [undefined],
    'fecha_cambio': [undefined],
    'fechaCreacion': [undefined],
    
  });

  displayedColumns: string[] = ['estatus','Nombre','periodo', 'creacion', 'actions']; //'Agente',
  dataSource: any = [];

  constructor(private sharedService: SharedService, 
              public dialog: MatDialog, 
              private comisionService: ComisionService, 
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
      this.filterForm.patchValue(appStoredData['filter']);
    }

    this.loadTrabajadorData(event);
    this.loadFilterCatalogs();
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

  reportePersonalActivoArea(){
    this.showMyStepper = true;
    this.showReportForm = false;
    this.isLoadingPDFArea = true;
    
    let params:any = {};
    let countFilter = 0;

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
   
    this.stepperConfig.steps[0].status = 2;

  }

  public loadFilterCatalogs(){
    this.comisionService.getFilterCatalogs().subscribe(
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
    );
  }

  public loadTrabajadorData(event?:PageEvent){
    
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

    let filterFormValues = this.filterForm.value;
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

    
    this.comisionService.getListPrincipal(params).subscribe(
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

          this.permisoImpresion = response.impresion;
          
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

  llenarPaginasLote(total)
  {
    let paginacion = Math.ceil(total / 100);
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

  compareImprimibleSelect(op,value){
    return op.id == value.id;
  }


  imprimirOficio(obj:any = null, lote:number = null)
  {
    this.toggleReportPanel();
    
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;
    this.stepperConfig.steps[0].status = 2;

    if(obj == null)//Checar los filtros
    {
      let params:any = {};
      let countFilter = 0;

      let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
      params.reporte = 'credencial';

      if(appStoredData['searchQuery']){
        params.query = appStoredData['searchQuery'];
      }

      for(let i in appStoredData['filter']){
        if(appStoredData['filter'][i]){
          if(i == 'distrito'){
            params[i] = appStoredData['filter'][i].distrito;
          }else if(i == 'clues'){
            params[i] = appStoredData['filter'][i].clues;
          }else if(i == 'cr'){
            params[i] = appStoredData['filter'][i].cr;
          }else if(i == 'imprimible'){
            params[i] = appStoredData['filter'][i].id;
          }else if(i == 'fechaCreacion'){
            let fecha = this.convertDate(appStoredData['filter'][i]);
            params[i] = fecha;
          }else{ //profesion y rama (grupos)
            params[i] = appStoredData['filter'][i].id;
          }

         
          countFilter++;
        }
      }

      if(countFilter > 0){
        params.active_filter = true;
      }
      this.comisionService.imprimirLoteAdscripcion((lote + 1), params).subscribe(
        response =>{
          if(response.error) {
            this.error_pdf(response);
          } else {    
            let jurisdiccion = response.data.data[0].rel_trabajador_comision_interna.cr_destino.clues.cve_jurisdiccion; 
            const reportWorker = this.iniciateWorker('COMISOIN-INTERNA-J'+jurisdiccion+"-L"+(lote + 1));
              let config = {  title: this.reportTitle, lote:true };
              //console.log(response.data.data);
              
              reportWorker.postMessage({data:{items: response.data.data, responsable:response.nombres, config:config},reporte:'trabajador/comision-interna'});
          }
          this.isLoading = false;
        },
        errorResponse =>{
          this.error_api(errorResponse);
        });
    }else{
      this.comisionService.buscarTrabajador(obj.id,{}).subscribe(
        response =>{
          if(response.error) {
            this.error_pdf(response);
          } else {    
            let rfc = response.data.rfc; 
            const reportWorker = this.iniciateWorker('COMISOIN-INTERNA-'+rfc);
              let config = {  title: this.reportTitle, lote:false };
              console.log(response);
              reportWorker.postMessage({data:{items: [response.data], responsable:response.nombres, config:config},reporte:'trabajador/comision-interna'});
          }
          this.isLoading = false;
        },
        errorResponse =>{
          this.error_api(errorResponse);
        }
      );
    }
  }

  error_pdf(obj:any)
  {
    let errorMessage = obj.error.message;
    this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
    this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
    this.isLoading = false;
  }

  error_api(obj:any)
  {
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
        catalogo_cr: this.filterCatalogs['cr']
      };

    }else{
      row ={
        catalogo_cr: this.filterCatalogs['cr']
      };
    } 
          

    if (this.mediaSize == 'lg') {
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '91vh',
        height: '8000px',
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
        maxHeight: '70vh',
        height: '72%',
        width: '100%',
        data: row
      };
    } else {
      configDialog = {
        width: '60%',
        maxHeight: '70vh',
        height: '500px',
        data: row
      }
    }
    
    const dialogRef = this.dialog.open(FormularioComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      //this.loadRegistroData();
    });
  }
}
