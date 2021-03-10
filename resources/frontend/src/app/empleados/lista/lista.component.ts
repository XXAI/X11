import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { EmpleadosService } from '../empleados.service';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { ConfirmarTransferenciaDialogComponent } from '../confirmar-transferencia-dialog/confirmar-transferencia-dialog.component';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { AgregarEmpleadoDialogComponent } from '../agregar-empleado-dialog/agregar-empleado-dialog.component';
import { AgregarFirmantesDialogComponent } from '../agregar-firmantes-dialog/agregar-firmantes-dialog.component';
import { PermissionsList } from '../../auth/models/permissions-list';
import { MediaObserver } from '@angular/flex-layout';
import { IfHasPermissionDirective } from 'src/app/shared/if-has-permission.directive';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { VerComponent } from '../ver/ver.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  providers:[
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false, showError: true } }
  ]
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
    '1-0':'help', //activo
    '1-1':'verified_user', //activo verificado 
    '2':'remove_circle', //baja
    '3':'warning', // No identificado
    '4':'swap_horizontal_circle' //en transferencia
  };

  filterCatalogs:any = {};
  filteredCatalogs:any = {};

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}

  filterForm = this.fb.group({
    'clues': [undefined],
    'cr': [undefined],
    'estatus': [undefined],
    'rama': [undefined],
    'grupos': [undefined]
  });

  displayedColumns: string[] = ['estatus','Nombre','RFC','Clues','actions']; //'Agente',
  dataSource: any = [];

  //showAdvancedFilter:boolean = false;
  constructor(private sharedService: SharedService, private empleadosService: EmpleadosService, public dialog: MatDialog, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit() {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    console.log(appStoredData);

    if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if(appStoredData['paginator']){
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if(event.selectedIndex >= 0){
        console.log(event);
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

    this.loadEmpleadosData(event);
    this.loadFilterCatalogs();
  }

  public loadFilterCatalogs(){
    this.empleadosService.getFilterCatalogs().subscribe(
      response => {
        console.log(response);
        this.filterCatalogs = {
          'clues': response.data.clues,
          'cr': response.data.cr,
          'estatus': response.data.estatus,
          'rama': response.data.rama
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

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
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

  public loadEmpleadosData(event?:PageEvent){
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

    this.loadFilterChips(filterFormValues);

    for(let i in filterFormValues){
      if(filterFormValues[i]){
        if(i == 'clues'){
          params[i] = filterFormValues[i].clues;
        }else if(i == 'cr'){
          params[i] = filterFormValues[i].cr;
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

    this.empleadosService.getEmpleadosList(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {

          if(response.estatus.grupo_usuario){
            this.puedeFinalizar = true;
            this.capturaFinalizada = response.estatus.finalizado;
          }else{
            this.puedeFinalizar = false;
            this.capturaFinalizada = false;
          }

          this.countPersonalActivo = response.estatus.estatus_validacion.total_activos;
          this.countPersonalValidado = response.estatus.estatus_validacion.total_validados;
          this.percentPersonalValidado = response.estatus.estatus_validacion.porcentaje;

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

  editEmpleado(index){
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    paginator.selectedIndex = index;
    this.sharedService.setDataToCurrentApp('paginator',paginator);
  }

  removeFilterChip(item,index){
    this.filterForm.get(item.id).reset();
    this.filterChips[index].active = false;
  }

  compareRamaSelect(op,value){
    return op.id == value.id;
  }

  compareEstatusSelect(op,value){
    return op.id == value.id;
  }

  applyFilter(){
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadEmpleadosData(null);
  }

  cleanFilter(filter){
    filter.value = '';
    //filter.closePanel();
  }

  cleanSearch(){
    this.searchQuery = '';
    //this.paginator.pageIndex = 0;
    //this.loadEmpleadosData(null);
  }

  toggleAdvancedFilter(status){
    if(status){
      this.advancedFilter.open();
    }else{
      this.advancedFilter.close();
    }
  }

  showAddEmployeDialog(){
    let configDialog = {};
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
    const dialogRef = this.dialog.open(AgregarEmpleadoDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log(valid);
      }
    });
  }

  showAddFirmanteDialog(){
    let configDialog = {};
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
    const dialogRef = this.dialog.open(AgregarFirmantesDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log(valid);
      }
    });
  }

  confirmTransferEmploye(id:number,i:number){
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      };
    }else{
      configDialog = {
        width: '95%',
      }
    }
    configDialog['data'] = {id:id};
    /*width: '80%',
      data:{id:id}*/

    const dialogRef = this.dialog.open(ConfirmarTransferenciaDialogComponent, configDialog);

    this.selectedItemIndex = i;

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadEmpleadosData();
      }
    });
  }

  verEmpleado(id: number, index: number){
    this.selectedItemIndex = index;
    
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    paginator.selectedIndex = index;
    this.sharedService.setDataToCurrentApp('paginator',paginator);

    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{id: id, puedeEditar: !this.capturaFinalizada, scSize:this.mediaSize}
      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '90vh',
        height: '643px',
        data:{id: id, puedeEditar: !this.capturaFinalizada}
      }
    }

    const dialogRef = this.dialog.open(VerComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });
  }

  /*agenteCertificador(id: number){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Agente Certificador',dialogMessage:'¿Desea establecer/remover a esta persona como agente certificador?, escriba ACEPTAR para confirmar.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoadingAgent = true;
        this.empleadosService.establecerAgenteCertificador(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadEmpleadosData();
            }
            this.isLoadingAgent = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoadingAgent = false;
          }
        );
      }
    });
  }*/

  confirmUntieEmploye(id: number)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Liberar Empleado',dialogMessage:'¿Realmente desea liberar el trabajador de su clues? Escriba LIBERAR a continuación para realizar el proceso.',validationString:'LIBERAR',btnColor:'primary',btnText:'Liberar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.empleadosService.desligarEmpleado(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadEmpleadosData();
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
      }
    });
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

  endValiations(){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Finalizar Captura',dialogMessage:'¿Realmente desea finalizar la validación de los datos? este proceso cerrará la plataforma para la edición de datos, escriba FINALIZAR para realizar esta acción.',validationString:'FINALIZAR',btnColor:'primary',btnText:'Finalizar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoading = true;
        this.empleadosService.finalizarValidacion().subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
            } else {
              console.log(response);
              this.puedeFinalizar = true;
              this.capturaFinalizada = response.finalizado;
            }
            this.isLoading = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.message;
            }
            //this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }
    });
  }

  reportePersonalActivoExcel(){
    this.isLoadingExcel = true;
    let params:any = {};
    let countFilter = 0;

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);

    params.reporte = 'personal-activo';
    params.export_excel = true;

    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }

    for(let i in appStoredData['filter']){
      if(appStoredData['filter'][i]){
        if(i == 'clues'){
          params[i] = appStoredData['filter'][i].clues;
        }else if(i == 'cr'){
          params[i] = appStoredData['filter'][i].cr;
        }else{ //profesion y rama
          params[i] = appStoredData['filter'][i].id;
        }
        countFilter++;
      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }

    this.empleadosService.getEmpleadosList(params).subscribe(
      response => {
        //FileSaver.saveAs(response);
        FileSaver.saveAs(response,'reportePersonalActivo');
        this.isLoadingExcel = false;
      },
      errorResponse =>{
        console.log(errorResponse);

        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoadingExcel = false;
      }
    );
  }

  reportePersonalActivo(){
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    let params:any = {};
    let countFilter = 0;

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
    console.log(appStoredData);

    params.reporte = 'personal-activo';

    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }

    for(let i in appStoredData['filter']){
      if(appStoredData['filter'][i]){
        if(i == 'clues'){
          params[i] = appStoredData['filter'][i].clues;
        }else if(i == 'cr'){
          params[i] = appStoredData['filter'][i].cr;
        }else{ //profesion y rama
          params[i] = appStoredData['filter'][i].id;
        }
        countFilter++;
      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }
    
    this.stepperConfig.steps[0].status = 2;

    this.empleadosService.getEmpleadosList(params).subscribe(
      response =>{
        //console.log(response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
          this.isLoading = false;
          //this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
            this.stepperConfig.steps[0].status = 3;
            this.stepperConfig.steps[1].status = 2;
            this.stepperConfig.currentIndex = 1;

            const reportWorker = new ReportWorker();
            reportWorker.onmessage().subscribe(
              data => {
                this.stepperConfig.steps[1].status = 3;
                this.stepperConfig.steps[2].status = 2;
                this.stepperConfig.currentIndex = 2;

                console.log(data);
                FileSaver.saveAs(data.data,'PersonalActivo');
                reportWorker.terminate();

                this.stepperConfig.steps[2].status = 3;
                this.isLoadingPDF = false;
                this.showMyStepper = false;
            });

            reportWorker.onerror().subscribe(
              (data) => {
                //this.sharedService.showSnackBar('Error: ' + data.message,null, 3000);
                this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
                this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
                this.isLoadingPDF = false;
                //console.log(data);
                reportWorker.terminate();
              }
            );
            
            let config = {
              title: this.reportTitle,
              showSigns: this.reportIncludeSigns, 
            };
            console.log(response.data);
            reportWorker.postMessage({data:{items: response.data, config:config, firmantes: response.firmantes, responsables: response.responsables},reporte:'empleados/personal-activo'});
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
        
      }
    );


    /*this.empleadosService.reporteEmpleados().subscribe(
      response =>{
        const reportWorker = new ReportWorker();
        reportWorker.onmessage().subscribe(
          data => {
            this.isLoadingPDF = false;
            console.log(data);
            FileSaver.saveAs(data.data,'PersonalActivo');
        });
        reportWorker.postMessage({data:response,reporte:'empleados/personal-activo'});
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );*/
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

    this.empleadosService.getEmpleadosAreaList(params).subscribe(
      response =>{
        //console.log(response);
        //console.log(response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
          //this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
            this.stepperConfig.steps[0].status = 3;
            this.stepperConfig.steps[1].status = 2;
            this.stepperConfig.currentIndex = 1;

            const reportWorker = new ReportWorker();
            reportWorker.onmessage().subscribe(
              data => {
                this.stepperConfig.steps[1].status = 3;
                this.stepperConfig.steps[2].status = 2;
                this.stepperConfig.currentIndex = 2;

                //console.log(data);
                FileSaver.saveAs(data.data,'PersonalActivoArea');
                reportWorker.terminate();

                this.stepperConfig.steps[2].status = 3;
                this.isLoadingPDFArea = false;
                this.showMyStepper = false;
            });

            reportWorker.onerror().subscribe(
              (data) => {
                //this.sharedService.showSnackBar('Error: ' + data.message,null, 3000);
                this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
                this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
                this.isLoadingPDFArea = false;
                //console.log(data);
                reportWorker.terminate();
              }
            );
            
            let config = {
              title: "Reporte Personal Activo por Área",
              
            };

            reportWorker.postMessage({data:{items: response.data, config:config, firmantes: response.firmantes, responsables: response.responsables},reporte:'empleados/personal-activo-area'});
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );

  }
}
