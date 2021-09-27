import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TramitesService } from '../tramites.service';
import { ImportarService } from '../importar.service';

import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface VerTrabajadorData {
  nombre?: any;
  rfc?: any;
  observacion?: any;
  arreglo?: [];
}

@Component({
  selector: 'app-ver-informacion-dialog',
  templateUrl: './ver-informacion-dialog.component.html',
  styleUrls: ['./ver-informacion-dialog.component.css']
})
export class VerInformacionDialogComponent implements OnInit {

  nombre:string;
  observacion:string;
  rfc:string;
  documentacion: any;
  public arreglo_datos: Array<any> = [
    {description: 'ACTA DE NACIMIENTO', value: '1'},
    {description: "CURP", value: '2'},
    {description: "CONSTANCIA DE ANTECEDENTES NO PENALES", value: '3'},
    {description: "TÍTULO (TODOS LOS QUE CUENTE)", value: '4'},
    {description: "CÉDULA PROFESIONAL (TODOS LOS QUE CUENTE)", value: '5'},
    {description: "SOLICITUD DE EMPLEO", value: '6'}
  ];
  
  constructor(private fb: FormBuilder,
    private importarService: ImportarService,
    public dialogRef: MatDialogRef<VerInformacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerTrabajadorData,
    public dialog: MatDialog,
    private apiService: TramitesService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    console.log(this.data);
    this.nombre = this.data.nombre;
    this.rfc = this.data.rfc;
    this.observacion = this.data.observacion;
    this.documentacion = this.data.arreglo;
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
