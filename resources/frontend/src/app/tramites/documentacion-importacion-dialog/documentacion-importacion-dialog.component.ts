import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, NgModel } from '@angular/forms';
import { TramitesService } from '../tramites.service';
import { merge,interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, switchMap, filter, first } from 'rxjs/operators';


export interface VerTrabajadorData {
  id?: string;
  rfc?:string;
}

@Component({
  selector: 'app-documentacion-importacion-dialog',
  templateUrl: './documentacion-importacion-dialog.component.html',
  styleUrls: ['./documentacion-importacion-dialog.component.css'],
  providers:[
    TramitesService
  ]
})
export class DocumentacionImportacionDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  grupos:any [] = [];
  loading: boolean;

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
    
    private apiService: TramitesService) { }

  ngOnInit (){
    this.archivoSubido = false;
    this.enviandoDatos = false;
    this.object = {}
    this.form = this.fb.group(
      {
        titulo: [''],
      }
    );

    this.loading = true;
    this.permisosError = false;    
    this.errorArchivo = false;
    
  }
  
  ngOnDestroy(){
    if(this.objectSubscription != null){
      this.objectSubscription.unsubscribe();
    }
  }


  ngAfterViewInit(){

  }

  fileChange(event) {
		let fileList: FileList = event.target.files;
		if (fileList.length > 0) {
			this.archivo = fileList[0];
      console.log(this.archivo);
		}
  }
  
  subir() {
    for (const key in this.form.controls) {
      this.form.get(key).clearValidators();
      this.form.get(key).updateValueAndValidity();
    }  

    this.permisosError = false;
    this.errorArchivo = false;

		if (this.archivo) {
			this.archivoSubido = false;
      this.loading = true;

			let usuario = JSON.parse(localStorage.getItem("usuario"));

      let formData: FormData = new FormData();
      formData.append('rfc', this.form.get("titulo").value);
			formData.append('archivo', this.archivo, this.archivo.name);

		  this.disableForm();
			//let options = new RequestOptions({ headers: headers });

      var responseHeaders: any;
			var contentDisposition: any;

      this.apiService.subir(formData).subscribe(
        response => {
            this.archivoSubido = true;
            this.loading = false;
						this.progreso = 100;
            this.archivo = null;
            this.enableForm();
				
        }, errorResponse => {
          this.loading = false;
          this.enableForm();
          if(errorResponse.status == 409){

            
          } else {
            
          } 
          this.progreso = 100;
          this.loading = false;       
        }     
      )			
		} else {
      this.errorArchivo = true;
      
    }
	}
  disableForm(){
    this.form.get('titulo').disable();
  }

  enableForm(){
    this.form.get('titulo').enable();
  }

  crear(){
    return;
    
  }

  editar(){
    
  }

  cancelar(): void {
    //this.dialogRef.close({ last_action: "none"});
  }
  borrar(): void {
    
  }
  guardar(): void {
    for (const key in this.form.controls) {
      this.form.get(key).clearValidators();
      this.form.get(key).updateValueAndValidity();
    }  

    this.permisosError = false;

    /*if(this.data.edit){
      this.editar();
    } else {      
      this.crear();
    }*/
  }

  serverValidator(error: {[key: string]: any}):ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

      return error;
    }
  }

  setErrors(validationErrors:any[]){
    this.permisosError = false;
    this.errorArchivo = false;
    var  noTieneGrupo = false;
    var bloqueado = false;
    Object.keys(validationErrors).forEach( prop => {
      const formControl = this.form.get(prop);
      if(formControl){

        formControl.markAsTouched();       

        var array = [];
        for(var x in validationErrors[prop]){
          array.push(this.serverValidator({[validationErrors[prop][x]]: true}));
        }
        formControl.setValidators(array);              
        formControl.updateValueAndValidity();
      } else {
        if(prop == "archivo"){
          this.errorArchivo = true;
        }
        if(prop == "grupo"){
          noTieneGrupo = true;
        }

        if(prop == "bloqueado"){
          bloqueado = true;
        }
      }
    });
    if(noTieneGrupo){
      
    }

    if(bloqueado){
      
    }
  }
}
