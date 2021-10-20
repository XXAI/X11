import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, NgModel, FormArray, FormControl } from '@angular/forms';
import { TramitesService } from '../tramites.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';

export interface VerTrabajadorData {
  id?: string;
  rfc?:string;
  nombre?:string;
}

@Component({
  selector: 'app-cancelar-documentacion-dialog',
  templateUrl: './cancelar-documentacion-dialog.component.html',
  styleUrls: ['./cancelar-documentacion-dialog.component.css']
})
export class CancelarDocumentacionDialogComponent implements OnInit {
  form: FormGroup;
  grupos:any [] = [];
  loading: boolean;
  nombre:string;
  isLoading: boolean;
  
  id:any;
  permisosError:boolean;
  objectSubscription: Subscription;
  object:any;

  archivo: File = null;
  archivoSubido:boolean;
  enviandoDatos:boolean;
  progreso: number = 0; 
  errorArchivo:boolean;

  public checks: Array<any> = [
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CancelarDocumentacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerTrabajadorData,
    public dialog: MatDialog,
    private tramitesService: TramitesService,
    private sharedService: SharedService) { }

  ngOnInit (){
    this.nombre = this.data.nombre;
    this.form = this.fb.group(
      {
        requerimiento: new FormArray([]),
        observacion: ['', Validators.required],
      }
    );
    this.isLoading = false;
    this.loading = true;
  }
  
  onCheckChange(event) {
    const formArray: FormArray = this.form.get('requerimiento') as FormArray;
  
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
      //formArray.push(new FormControl(1));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  subir() {
    console.log(this.form.value);
    this.isLoading = true;
    this.tramitesService.setCambioEstatus(this.data.id, 2, this.form.value).subscribe(
      response =>{
        this.isLoading = false;
        this.sharedService.showSnackBar("Se ha denegado el archivo", null, 3000);
        this.dialogRef.close(true);
      },
      errorResponse =>{
        this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        //this.isLoading = false;
    });
		
	}
  cancelar(): void {
    this.dialogRef.close(false);
  }
}
