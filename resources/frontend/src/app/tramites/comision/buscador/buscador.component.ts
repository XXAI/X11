import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ComisionService } from '../comision.service';
import { SharedService } from '../../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

export interface AgregarEmpleadoDialogData {
  scSize?: string;
}
@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BuscadorComponent implements OnInit {

  mediaSize:string;
  search:string = "";
  isLoading: boolean = false;
  selectedItemIndex:number = 1;

  searchQuery: string = '';

  resultsLength: number = 0;
  
  dataSource: any = [];
  displayedColumns = ['nombre','destino', 'oficio','periodo', 'creador'];

  constructor(
    public dialogRef: MatDialogRef<BuscadorComponent>,
    private sharedService: SharedService, 
    private comisionService: ComisionService, 
    public dialog: MatDialog, private fb: FormBuilder
  ) { }


  ngOnInit() {
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  buscarTrabajadores():void{
    this.isLoading = true;
    this.dataSource = [];
    let params:any;
    params = {busqueda_empleado: this.search }
    
    this.comisionService.buscarTrabajadorComision(params).subscribe(
      response => {
        this.resultsLength = response.data.length;
        this.dataSource = response.data;
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
}
