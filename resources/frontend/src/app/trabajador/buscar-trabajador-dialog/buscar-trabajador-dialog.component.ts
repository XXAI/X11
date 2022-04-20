import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { TrabajadorService } from '../trabajador.service';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { MatTable } from '@angular/material/table';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
//import { ConfirmarTransferenciaDialogComponent } from '../confirmar-transferencia-dialog/confirmar-transferencia-dialog.component';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface AgregarEmpleadoDialogData {
  scSize?: string;
}

@Component({
  selector: 'app-buscar-trabajador-dialog',
  templateUrl: './buscar-trabajador-dialog.component.html',
  styleUrls: ['./buscar-trabajador-dialog.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BuscarTrabajadorDialogComponent implements OnInit {

  mediaSize:string;
  search:string = "";
  isLoading: boolean = false;
  isLoadingCredential: boolean = false;
  fotoTrabajador = 'assets/profile-icon.svg';

  photoPlaceholder = 'assets/profile-icon.svg';

  datosCredencial:any;

  searchQuery: string = '';

  selectedTab:number = 0;
  actionLabel:string = '';

  /*pageEvent: PageEvent;
  currentPage: number = 0;
  */
  resultsLength: number = 0;
  pageSize: number = 20;

  dataSource: any = [];
  columnsToDisplay = ['estatus','nombre', 'clues','actions'];

  cluesOrigen:any = {};
  crOrigen:any = {};

  itemSelected:any;

  actionSelected:string;

  cluesCatalogo:any[];
  cluesDestino:any;
  cluesSearch:FormControl = new FormControl();
  filteredClues:Observable<any[]>;

  crCatalogo:any[];
  crDestino:any;
  crSearch:FormControl = new FormControl();
  filteredCr:Observable<any[]>;

  statusIcon:any = {
    '1-0':'help', //activo
    '1-1':'verified_user', //activo verificado 
    '2':'remove_circle', //baja
    '3':'warning', // No identificado
    '4':'swap_horizontal_circle' //en transferencia
  };
  
  constructor(
    public dialogRef: MatDialogRef<BuscarTrabajadorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgregarEmpleadoDialogData,
    private sharedService: SharedService, 
    private TrabajadoresService: TrabajadorService, 
    public dialog: MatDialog, private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.cluesCatalogo = [];

    if(this.data.scSize){
      this.mediaSize = this.data.scSize;
    }

    this.TrabajadoresService.getFilterCatalogs().subscribe(
      response => {
        this.cluesCatalogo = response.data.clues;

        if(this.cluesCatalogo.length == 1){
          let cluesSeleccionada = JSON.parse(JSON.stringify(this.cluesCatalogo[0]));
          cluesSeleccionada.cr = undefined;

          this.cluesDestino = cluesSeleccionada;

          this.crCatalogo = this.cluesCatalogo[0].cr;
          this.filteredCr = this.crSearch.valueChanges.pipe(startWith(''),map(value => this._filter(value,this.crCatalogo,'descripcion'))); 

          if(this.crCatalogo.length == 1){
            this.crDestino = this.crCatalogo[0];
          }
        }
        console.log(response);
      }
    );
    
    this.filteredClues = this.cluesSearch.valueChanges.pipe(startWith(''),map(value => this._filter(value,this.cluesCatalogo,'nombre_unidad')));

    //this.filteredCr = this.crSearch.valueChanges.pipe(startWith(''),map(value => this._filter(value,this.crCatalogo,'descripcion'))); 
  }

  private _filter(value: any, catalog: any[], valueField: string): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return catalog.filter(option => option[valueField].toLowerCase().includes(filterValue));
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  aceptar(): void {
    this.dialogRef.close(true);
  }

  solicitarEmpleado(item:any){
    this.actionLabel = 'Solicitar Empleado';
    this.actionSelected = 'solicitar';
    this.accion(item);
  }

  activarEmpleado(item:any){
    this.actionLabel = 'Activar y Asignar Empleado';
    this.actionSelected = 'activar';
    this.accion(item);
  }

  accion(item){
    this.itemSelected = item;
    this.selectedTab = 1;
    this.cluesOrigen = item.clues;
    this.crOrigen = item.cr;
    this.cargarDatosCredencial();
  }

  cancelAction(){
    this.actionLabel = '';
    this.selectedTab = 0;
    this.itemSelected = undefined;
    this.datosCredencial = undefined;
  }

  activarEmpleadoComision(obj)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ACTIVAR TRABAJADOR',dialogMessage:'¿Realmente desea activar el trabajador? Escriba ACTIVAR a continuación para realizar el proceso.',validationString:'ACTIVAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        let params = {};
        this.TrabajadoresService.activarTrabajadorSindical(obj.id,params).subscribe(
          response =>{
           this.buscarTrabajadores();
           var errorMessage = "Trabajador Activado";
           this.sharedService.showSnackBar(errorMessage, null, 3000);
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error al activar el trabajador.";
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }
    });
  }

  confirmarSolicitar(){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Solicitar Transferencia de Empleado',dialogMessage:'¿Realmente desea solicitar la transferencia del trabajador a su clues? Escriba SOLICITAR a continuación para realizar el proceso.',validationString:'SOLICITAR',btnColor:'primary',btnText:'Aceptar'}
    });

    let params = {
      clues: this.cluesDestino.clues,
      cr: this.crDestino.cr
    };
    let id = this.itemSelected.id;

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        /*this.TrabajadoresService.solicitarTransfer(id,params).subscribe(
          response =>{
            this.isLoading = false;
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              console.log('Solicitar');
              this.cancelAction();
              this.buscarTrabajadores();
            }
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );*/
      }
    });
  }

  confirmarActivar(){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Activar Empleado',dialogMessage:'¿Realmente desea activar al trabajador seleccionado? Escriba ACTIVAR a continuación para realizar el proceso.',validationString:'ACTIVAR',btnColor:'primary',btnText:'Aceptar'}
    });

    let params = {
      clues: this.cluesDestino.clues,
      cr: this.crDestino.cr
    };
    let id = this.itemSelected.id;

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.TrabajadoresService.activarTrabajador(id,params).subscribe(
          response =>{
            this.isLoading = false;
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              console.log('Activar');
              this.cancelAction();
              this.buscarTrabajadores();
            }
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

  editarEmpleado(){
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    this.sharedService.setDataToCurrentApp('paginator',undefined);
    this.dialogRef.close();
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  getCrCatalog(clues){
    this.crCatalogo = clues.cr;
    this.filteredCr = this.crSearch.valueChanges.pipe(startWith(''),map(value => this._filter(value,this.crCatalogo,'descripcion'))); 

    if(this.crCatalogo.length == 1){
      this.crDestino = this.crCatalogo[0];
    }else{
      this.crDestino = undefined;
    }
  }

  buscarTrabajadores():void{
    this.isLoading = true;
    this.dataSource = [];
    let params:any;
    params = { page: 1, per_page: this.pageSize, busqueda_empleado: this.search }
    
    this.TrabajadoresService.buscarTrabajadores(params).subscribe(
      response => {
        //console.log(response);
        this.dataSource = [];
        this.resultsLength = 0;
        //console.log(response);
        if(response.total > 0){
          this.dataSource = response.data;
          this.resultsLength = response.total;
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
  }

  cargarDatosCredencial(){
    if(this.itemSelected.clave_credencial){
      this.isLoadingCredential = true;
      this.TrabajadoresService.verInfoTrabajador(this.itemSelected.id, {}).subscribe(
        response => {
          console.log(response);
          if(response.credencial != null) 
          {
            if(response.credencial.foto == 1)
            {
              this.fotoTrabajador = "data:image/png;base64,"+response.credencial.foto_trabajador;
            }else{

            }
          }else{
            this.fotoTrabajador = 'assets/trabajador.jpg';
          }
          this.datosCredencial = response;
          /*if(response.length > 0){
            this.datosCredencial = response[0];
            if(this.datosCredencial.tieneFoto == '1'){
              this.datosCredencial.photo = 'http://credencializacion.saludchiapas.gob.mx/images/credenciales/'+this.datosCredencial.id+'.'+this.datosCredencial.tipoFoto;
            }else{
              this.datosCredencial.photo = this.photoPlaceholder;
            }
          }else{
            this.datosCredencial = undefined;
          }*/
          this.isLoadingCredential = false;
        }
      );
    }
  }

}
