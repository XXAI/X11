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

import { AgregarFirmantesDialogComponent } from '../agregar-firmantes-dialog/agregar-firmantes-dialog.component';
import { PermissionsList } from '../../auth/models/permissions-list';
import { IfHasPermissionDirective } from 'src/app/shared/if-has-permission.directive';
import { MediaObserver } from '@angular/flex-layout';
import { TrabajadorService } from '../trabajador.service';

import { VerComponent } from '../ver/ver.component';
import { BuscarTrabajadorDialogComponent } from '../buscar-trabajador-dialog/buscar-trabajador-dialog.component';
import { BajaDialogComponent } from '../baja-dialog/baja-dialog.component';
import { TransferenciaTrabajadorDialogComponent } from '../transferencia-trabajador-dialog/transferencia-trabajador-dialog.component';
import { ComisionSindicalDialogComponent } from '../comision-sindical-dialog/comision-sindical-dialog.component';


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
  filtroAvanzado:boolean = true;

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
    'fiscales': [undefined],
    'rama': [undefined],
    'grupos': [undefined],
    'adscripcion': [undefined],
  });

  displayedColumns: string[] = ['estatus','RFC','Nombre','actions']; //'Agente',
  dataSource: any = [];

  constructor(private sharedService: SharedService, private trabajadorService: TrabajadorService, public dialog: MatDialog, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit() {
    
    this.cargarCluesAsistencia();
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

  cargarCluesAsistencia()
  {
    this.trabajadorService.cargaClues().subscribe(
      response =>{
        console.log(response);
        response.data.forEach(element => {
          //console.log(element);
          this.cluesAsistencia.push(element.clues);
        });
        //console.log(this.cluesAsistencia);
        //this.cluesAsistencia = response.data;
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

  showAddSignerDialog()
  {
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
        //console.log(valid);
      }
    });
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
        }else if(i == 'comisionado'){
          params[i] = appStoredData['filter'][i];
        }else if(i == 'e4'){
          params[i] = appStoredData['filter'][i];
        }else if(i == 'fiscales'){
          params[i] = appStoredData['filter'][i];
        }else{ //profesion y rama (grupos)
          params[i] = appStoredData['filter'][i].id;
        }
        countFilter++;
      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }
    
    this.stepperConfig.steps[0].status = 2;

    this.trabajadorService.getTrabajadorList(params).subscribe(
      response =>{
        
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
            reportWorker.postMessage({data:{items: response.data, config:config, firmantes: response.firmantes, responsables: response.responsables},reporte:'trabajador/personal-activo'});
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

  TransferirTrabajador(obj)
  {
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

    configDialog['data'] = {id:obj.id, crActual: obj.cr_fisico_id};
    //configDialog['crActual'] = {id:obj.cr_fisico_id};
//console.log(configDialog);
    const dialogRef = this.dialog.open(TransferenciaTrabajadorDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        //console.log(valid);
        this.loadTrabajadorData();
      }
    });
  }

  ComisionSindical(obj)
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, id: obj.id, nombre: obj.nombre+" "+ obj.apellido_paterno+" "+obj.apellido_materno}
      };
    }else{
      configDialog = {
        width: '95%',
        data:{id: obj.id, nombre: obj.nombre+" "+ obj.apellido_paterno+" "+obj.apellido_materno }
      }
    }

    const dialogRef = this.dialog.open(ComisionSindicalDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadTrabajadorData();
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
        }else if(i == 'comisionado'){
          params[i] = appStoredData['filter'][i];
        }else if(i == 'e4'){
          params[i] = appStoredData['filter'][i];
        }else if(i == 'fiscales'){
          params[i] = appStoredData['filter'][i];
        }else{ //profesion y rama (grupos)
          params[i] = appStoredData['filter'][i].id;
        }
        countFilter++;
      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }

    console.log(params);
    this.trabajadorService.getTrabajadorList(params).subscribe(
      response => {
        console.log(response);
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

    /*this.empleadosService.getEmpleadosAreaList(params).subscribe(
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
    );*/

  }

  public loadFilterCatalogs(){
    this.trabajadorService.getFilterCatalogs().subscribe(
      response => {
        console.log(response);
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

  BajaTrabajador(objeto:any)
  {
    let configDialog = {};
    let nombre = objeto.nombre+" "+objeto.apellido_paterno+" "+objeto.apellido_materno;
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, id: objeto.id, nombre_completo: nombre}
      };
    }else{
      configDialog = {
        width: '95%',
        data:{ id: objeto.id, nombre_completo: nombre }
      }
    }
    const dialogRef = this.dialog.open(BajaDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log(valid);
      }
      this.loadTrabajadorData();
    });
  }
  
  verEmpleado(id: number, index: number){
    
    this.selectedItemIndex = index;
    
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    paginator.selectedIndex = index;
    this.sharedService.setDataToCurrentApp('paginator',paginator);

    let configDialog = {};
    console.log(this.mediaSize);
    if(this.mediaSize == 'lg'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '91vh',
        height: '620px',
        width: '100%',
        data:{id: id, puedeEditar: !this.capturaFinalizada, cluesAsistencia: this.cluesAsistencia}
      }
    }else if(this.mediaSize == "md"){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{id: id, puedeEditar: !this.capturaFinalizada, cluesAsistencia: this.cluesAsistencia}
      }
    }else if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '72%',
        width: '100%',
        data:{id: id, puedeEditar: !this.capturaFinalizada, scSize:this.mediaSize, cluesAsistencia: this.cluesAsistencia}
      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '91vh',
        height: '620px',
        data:{id: id, puedeEditar: !this.capturaFinalizada, cluesAsistencia: this.cluesAsistencia}
      }
    }

    //console.log(configDialog);

    const dialogRef = this.dialog.open(VerComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });
  }

  liberarTrabajador(id: number)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Liberar Trabajador',dialogMessage:'¿Realmente desea liberar al trabajador de su clues y cr Física? Escriba LIBERAR a continuación para realizar el proceso.',validationString:'LIBERAR',btnColor:'primary',btnText:'Liberar'}
    });
    this.isLoading = true;
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.trabajadorService.desligarEmpleado(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadTrabajadorData();
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

  validateTrabajador(id: number)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Validar Trabajador',dialogMessage:'¿Realmente desea validar al trabajador ? Escriba VALIDAR a continuación para realizar el proceso.',validationString:'VALIDAR',btnColor:'primary',btnText:'Validar'}
    });
    this.isLoading = true;
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.trabajadorService.validarTrabajador(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadTrabajadorData();
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
        }else if(i == 'fiscales'){
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

    this.trabajadorService.getTrabajadorList(params).subscribe(
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
          this.countPersonalActualizado = response.estatus.estatus_actualizacion.total_actualizado;
          this.percentPersonalActualizado = (response.estatus.estatus_actualizacion.total_actualizado/response.estatus.estatus_validacion.total_validados) * 100;
          
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
        }else if(i == 'fiscales'){
          item.tag = data[i].fiscales;
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
    const dialogRef = this.dialog.open(BuscarTrabajadorDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log(valid);
      }
      this.loadTrabajadorData();
    });
  }

  editTrabajador(index){
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    paginator.selectedIndex = index;
    this.sharedService.setDataToCurrentApp('paginator',paginator);
  }

  ResetContrasena(obj)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Resetear Contraseña',dialogMessage:'¿Realmente desea resetear la contraseña de acceso al trabajador?, Escriba ACEPTAR a continuación para realizar el proceso, una vez aceptado el proceso el usuario y contraseña sera su RFC con homoclave.',validationString:'ACEPTAR',btnColor:'primary',btnText:'RESETEAR'}
    });
    this.isLoading = true;
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.trabajadorService.resetearCuenta(obj.rfc).subscribe(
          response =>{
            /*if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {*/
              this.sharedService.showSnackBar("Se ha reseteado la contraseña del trabajador, favor de verificar", null, 3000);
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
      }else
      {
        this.isLoading = false;
      }
    });
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
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
    //console.log(valor+" - "+trabajador_id);
    this.trabajadorService.setTramite(valor, trabajador_id).subscribe(
      response => {
        console.log(response);
        this.sharedService.showSnackBar("Se guardo correctamente", null, 3000);
        this.OficioSolicitud(response.id);
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar(responsError.error, null, 3000);
      }
    );
  }

  OficioSolicitud(id)
  {
    this.trabajadorService.createFileComision(id).subscribe(
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
        
      });
  }
}
