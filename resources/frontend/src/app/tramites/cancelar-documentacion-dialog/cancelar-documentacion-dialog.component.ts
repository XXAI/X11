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
    {description: 'ACTA DE NACIMIENTO', value: '1'},
    {description: "CURP", value: '2'},
    {description: "CONSTANCIA DE ANTECEDENTES NO PENALES", value: '3'},
    {description: "TÍTULO (TODOS LOS QUE CUENTE)", value: '4'},
    {description: "CÉDULA PROFESIONAL (TODOS LOS QUE CUENTE)", value: '5'},
    {description: "SOLICITUD DE EMPLEO", value: '6'}
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
    this.tramitesService.setCambioEstatus(this.data.id, 2, this.form.value).subscribe(
      response =>{
        this.sharedService.showSnackBar("Se ha denegado el archivo", null, 3000);
        this.dialogRef.close(true);
      },
      errorResponse =>{
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
