import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TramitesService } from '../tramites.service';
import { ImportarService } from '../importar.service';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';

import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface VerTrabajadorData {
  id?: string;
  rfc?:string;
  nombre?:string;
  tipo?:number;
}

@Component({
  selector: 'app-documentacion-importacion-dialog',
  templateUrl: './documentacion-importacion-dialog.component.html',
  styleUrls: ['./documentacion-importacion-dialog.component.css'],
  providers:[
    TramitesService
  ]
})
export class DocumentacionImportacionDialogComponent implements OnInit {
  form: FormGroup;
  grupos:any [] = [];
  isLoading: boolean;
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
    private importarService: ImportarService,
    public dialogRef: MatDialogRef<DocumentacionImportacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerTrabajadorData,
    public dialog: MatDialog,
    private apiService: TramitesService,
    private sharedService: SharedService) { }

  ngOnInit (){
    this.nombre = this.data.nombre;

    this.archivoSubido = false;
    this.enviandoDatos = false;
    this.object = {};
    this.form = this.fb.group(
      {
        file: ['', Validators.required],
      }
    );

    this.isLoading = false;
    this.permisosError = false;    
    this.errorArchivo = false;
    
  }


  fileChange(event) {
		let fileList: FileList = event.target.files;
		if (fileList.length > 0) {
      this.archivo = <File>fileList[0];
      if(this.archivo.size > 6144000)
      {
        this.form.patchValue({file:null});
        this.archivo = null;
        this.sharedService.showSnackBar("Archivo supera el maximo de tamaño", null, 3000);
      }
		}
  }
  
  subir() {
    
		if (this.archivo) {
      const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
        width: '500px',
        data:{dialogTitle:'Confirmación',dialogMessage:'Solamente puede enviar un archivo único que contenga todos los documentos, en el orden que marca la lista, no mayor a 6 megabytes. ¿Realmente desea enviar este archivo? Para confirmar escriba ACEPTAR',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
      });
  
      dialogRef.afterClosed().subscribe(valid => {
        if(valid){
          this.archivoSubido = false;
          this.isLoading = true;
          let data = {'rfc': this.data.rfc, 'trabajador_id': this.data.id, 'tipo':this.data.tipo};
          this.importarService.upload(data, this.archivo, '').subscribe(
            response => {
              this.dialogRef.close(true);
              this.sharedService.showSnackBar("Ha subido correctamente el documento", null, 3000);
              this.isLoading = false;
              //console.log(response);
            }, errorResponse => {
              this.sharedService.showSnackBar(errorResponse.error.error, null, 3000);
              this.isLoading = false;
            });
         }
      });
			     
      
		} else {
      this.errorArchivo = true;
    }
	}
  
  
}
