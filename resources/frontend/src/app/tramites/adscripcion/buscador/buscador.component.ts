import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { AdscripcionService } from '../adscripcion.service';
import { SharedService } from '../../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

export interface DialogData {
  scSize?: string;
}

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  mediaSize:string;
  search:string = "";
  isLoading: boolean = false;
  selectedItemIndex:number = 1;

  searchQuery: string = '';

  resultsLength: number = 0;
  
  dataSource: any = [];
  displayedColumns = ['nombre','origen','destino', 'oficio', 'creador'];

  constructor(
    public dialogRef: MatDialogRef<BuscadorComponent>,
    private sharedService: SharedService, 
    private adscripcionService: AdscripcionService, 
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
    params = {busqueda_empleado: this.search, tipo:2 }
    
    this.adscripcionService.buscarTrabajadorAdscripcion(params).subscribe(
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
