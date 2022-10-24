import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DirectorioService } from '../directorio.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

export interface VerDataCR {
  CR: string;
  Unidad: string;
}

@Component({
  selector: 'app-agregar-personal',
  templateUrl: './agregar-personal.component.html',
  styleUrls: ['./agregar-personal.component.css']
})
export class AgregarPersonalComponent implements OnInit {

  isLoading: boolean = false;
  responsableIsLoading: boolean = false;
  filteredResponsable: Observable<any[]>;
  obj_seleccionado:any;
  
  tipo_trabajador:any =  [{id:1, nombre:'JEFE, RESPONSABLE O DIRECTOR'},{id:2, nombre:'JEFE RECURSOS HUMANOS'},{id:3, nombre:'JEFE DE ADMINISTRACIÓN'}];
  public responsableForm = this.fb.group({
    'cr': ['',[Validators.required]],
    'profesion': ['',[Validators.required]],
    'responsable': ['',[Validators.required]],
    'telefono': ['',[Validators.required]],
    'trabajador_id': [''],
    'cargo': ['',[Validators.required]],
    'tipo_responsable_id': ['',[Validators.required]]
  });

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AgregarPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerDataCR,
    private fb: FormBuilder,
    private directorioService: DirectorioService,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarBuscador();
    this.responsableForm.patchValue({cr: this.data.CR, cargo: this.data.Unidad});
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar()
  {
    if(this.responsableForm.value.responsable != null)
    {
      this.responsableForm.patchValue({trabajador_id: this.responsableForm.value.responsable.id});
      //console.log(this.responsableForm.value);
      this.directorioService.guardarResponsable(this.responsableForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha Guardado Correctamente", null, 3000);
          this.isLoading = false;
        },
        errorResponse =>{
          this.isLoading = false;
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
          
        }
      );
    }else{
      this.sharedService.showSnackBar("Debe de seleccionar un responsable", null, 3000);
    }
    //console.log(this.responsableForm.value);
  }

  cargarBuscador()
  {
    this.responsableForm.get('responsable').valueChanges
        .pipe(
          debounceTime(300),
          tap( () => {
            //this.element.loading = true;
              this.responsableIsLoading = true; 
          } ),
          switchMap(value => {
              if(!(typeof value === 'object')){
                this.responsableIsLoading = false;
                /*
                if( entidad != '' && municipio!="")
                {*/
                  console.log(value);
                  console.log(this.data.CR);

                  return this.directorioService.buscarTrabajador({query:value, cr:this.data.CR }).pipe(finalize(() => this.responsableIsLoading = false ));
                /*}else{
                  return [];
                }*/
                
              }else{
                this.responsableIsLoading = false; 
                return [];
              }
            }
          ),
        ).subscribe(items => this.filteredResponsable = items);
  }
  

  displayResponsableFn(item: any) {
    if (item) { 
      //console.log("entra");
      this.obj_seleccionado = item;
      //this.cargarTelefono(item);
      return item.nombre+" "+item.apellido_paterno+" "+item.apellido_materno; }
  }

  cargarTelefono()
  {
    //console.log(this.obj_seleccionado);
    //console.log(this.responsableForm.value.responsable);
    console.log(this.responsableForm.value);
    this.responsableForm.patchValue({telefono: this.responsableForm.value.responsable.telefono_celular});
  }
  
}
