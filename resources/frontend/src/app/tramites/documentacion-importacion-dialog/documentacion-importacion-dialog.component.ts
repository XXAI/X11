import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
			this.archivo = <File>fileList[0];
      console.log(this.archivo);
		}
  }
  
  subir() {
    console.log(this.archivo);

		if (this.archivo) {
			this.archivoSubido = false;
      
			
      /*let formData: FormData = new FormData();
      //formData.append('archivo', this.archivo, this.archivo.name);
      formData.append('prueba', 'uno');*/

      let datos = {rfc : 1};
      this.apiService.subir(datos ).subscribe(
        response => {
      	
        }, errorResponse => {
        }     
      )			
		} else {
      this.errorArchivo = true;
      
    }
	}
  
  
}
