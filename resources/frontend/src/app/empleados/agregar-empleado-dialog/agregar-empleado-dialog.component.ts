import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { EmpleadosService } from '../empleados.service';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatExpansionPanel } from '@angular/material';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { ConfirmarTransferenciaDialogComponent } from '../confirmar-transferencia-dialog/confirmar-transferencia-dialog.component';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'agregar-empleado-dialog',
  templateUrl: './agregar-empleado-dialog.component.html',
  styleUrls: ['./agregar-empleado-dialog.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AgregarEmpleadoDialogComponent implements OnInit {

  search:string = "";
  isLoading: boolean = false;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;
  dataSource: any = [];
  columnsToDisplay = ['estatus','nombre', 'clues'];//,'actions'
  //expandedElement: PeriodicElement | null;

  statusIcon:any = {
    '1-0':'help', //activo
    '1-1':'verified_user', //activo verificado 
    '2':'remove_circle', //baja
    '3':'warning', // No identificado
    '4':'swap_horizontal_circle' //en transferencia
  };
  
  constructor(
    public dialogRef: MatDialogRef<AgregarEmpleadoDialogComponent>,
    private sharedService: SharedService, 
    private empleadosService: EmpleadosService, 
    public dialog: MatDialog, private fb: FormBuilder
  ) { }

  
  ngOnInit() {
    
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  aceptar(): void {
    this.dialogRef.close(true);
  }

  asignarEmpleado(id:number){
    console.log(id);
  }

  buscarEmpleados():void{
    let params:any;
    params = { page: 1, per_page: this.pageSize, busqueda_empleado: this.search }
    
    this.empleadosService.buscarEmpleados(params).subscribe(
      response => {
        //console.log(response);
        this.dataSource = [];
        this.resultsLength = 0;
        //console.log(response);
        if(response.total > 0){
          this.dataSource = response.data;
          this.resultsLength = response.total;
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
}