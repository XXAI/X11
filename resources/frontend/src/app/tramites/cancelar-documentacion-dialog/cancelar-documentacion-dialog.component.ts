import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, NgModel } from '@angular/forms';
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
        observacion: ['', Validators.required],
      }
    );

    this.loading = true;
  }
  
  subir() {
    
    this.tramitesService.setCambioEstatus(this.data.id, 2, this.form.value.observacion).subscribe(
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
