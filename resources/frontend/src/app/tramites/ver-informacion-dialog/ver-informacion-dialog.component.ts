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
    {description: 'SOLICITUD DE EMPLEO CON FOTOGRAFIA', value: '1'},
    {description: "FOTOGRAFÍA TAMAÑO INFANTIL B/N O A COLOR EN PAPEL MATE, NO INSTANTÁNEA (1)", value: '2'},
    {description: "CURRICULÚM VITAE DEBIDAMENTE FIRMADO", value: '3'},
    {description: "CONSTANCIA DE NO INHABILITACIÓN (ACTUALIZADA 06 MESES)", value: '4'},
    {description: "CONSTANCIA DE NO ANTECEDENTES PENALES (ACTUALIZADA 06 MESES)", value: '5'},
    {description: "CERTIFICADO MÉDICO ACTUALIZADO (NO EXPEDIDA POR CRUZ ROJA MEXICANA, ISSSTE, PARTICULARES E IMSS)", value: '6'},
    {description: "*PROTESTA", value: '7'},
    {description: "ACTA DE NACIMIENTO ACTUALIZADA, VIGENCIA MÍNIMA 2018 ", value: '8'},
    {description: "CONSTANCIA DE SITUACIÓN FISCAL ACTUALIZADA (R.F.C.)", value: '9'},
    {description: "*PRE Y LIBERACIÓN DE LA CARTILLA MILITAR", value: '10'},
    {description: "ÚLTIMO GRADO DE ESTUDIOS", value: '11'},
    {description: "COMPROBANTE DE DOMICILIO (02 MESES)", value: '12'},
    {description: "CURP ACTUALIZADA", value: '13'},
    {description: "CREDENCIAL DE ELECTOR ACTUALIZADO", value: '14'},
    {description: "CUENTA Y CLAVE INTERBANCARIA (BANORTE Y/O BANCOMER)", value: '15'}
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
