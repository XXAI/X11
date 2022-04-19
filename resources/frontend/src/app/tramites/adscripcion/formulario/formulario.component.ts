import { Component, OnInit, Inject } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { AdscripcionService } from '../adscripcion.service';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
/* Utilerias */
/*Dialogs */

export interface RegistroData {
  id: number;
  trabajador_id?:number;
  clues?:any;
  clues_adscripcion?:any;
  fecha_oficio?:string;
  fecha_cambio?:string;
  catalogo_cr:any;
  trabajador:any;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  trabajadorIsLoading:boolean = false;
  cluesIsLoading:boolean = true;
  filteredCatalogs:any = [];
  arreglo_trabajador = [];
  filterCatalogs:any = {};
  clues_nominal:string = "";
  cr_nominal:string = "";
  isLoading:boolean = false;
  buscador:boolean = false;

  constructor(
    private sharedService: SharedService, 
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    public dialogRef: MatDialogRef<FormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistroData,
    public router: Router,
    public adscripcionService:AdscripcionService
    ) { }

  public formularioForm = this.fb.group({
   
    'trabajador': [''],
    'clues': ['',[Validators.required]],
    'fecha_oficio': ['',[Validators.required]],
    'fecha_cambio': ['',[Validators.required]],
    'trabajador_id': ['',[Validators.required]],
  });

  ngOnInit(): void {
    
    this.loadFilterCatalogs();
  }

  displayTrabajadorFn(item: any) {
    if (item) { return item.descripcion; }
  }

  displaycluesFn(label: string){
    return (val) => this.displayFn(val,label);
  }
  
  displaytrabajadorFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  public loadFilterCatalogs(){
      this.filterCatalogs = {
        'cr': this.data.catalogo_cr,
      };
      this.filteredCatalogs['cr'] = this.formularioForm.controls['clues'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'cr','descripcion_actualizada')));
      this.cluesIsLoading = false;
      
      if(this.data.id)
      {
        this.arreglo_trabajador = [{id: this.data.trabajador.id, nombre: this.data.trabajador.nombre, apellido_paterno: this.data.trabajador.apellido_paterno, apellido_materno: this.data.trabajador.apellido_materno }];

        this.formularioForm.patchValue({
          trabajador:'',
          clues:this.data.clues, 
          fecha_oficio:this.data.fecha_oficio, 
          fecha_cambio:this.data.fecha_cambio,
          trabajador_id: this.data.trabajador.id
        });
        
        this.clues_nominal = this.data.clues_adscripcion.clues+" "+this.data.clues_adscripcion.descripcion_actualizada;
        this.cr_nominal = this.data.clues_adscripcion.cr+" "+this.data.clues_adscripcion.descripcion_actualizada
      }
    /*this.adscripcionService.getFilterCatalogs().subscribe(
      response => {
        //console.log(response);
        this.filterCatalogs = {
          'cr': response.data.cr,
        };

        console.log(this.data);
        
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );*/
  }

  public buscarTrabajador()
  {
    this.arreglo_trabajador = [];
    this.buscador = true;
    this.adscripcionService.getTrabajador({busqueda_empleado: this.formularioForm.controls['trabajador'].value}).subscribe(
      response => {
       this.arreglo_trabajador = response.data;
       this.buscador = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.buscador = false;
      }
    );
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
   
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
  }

  obtenerDatos(datos){
    //console.log(datos);
    this.arreglo_trabajador.forEach(element => {
      if(datos == element.id)
      {
        this.clues_nominal = element.datoslaboralesnomina.clues.clues+" "+element.datoslaboralesnomina.clues.nombre_unidad;
        this.cr_nominal = element.datoslaboralesnomina.cr.cr+" "+element.datoslaboralesnomina.cr.descripcion_actualizada
      }
    });
  }

  GUARDAR()
  {
    this.isLoading = true;
    if(this.data.id)
    {
      this.adscripcionService.editarAdscripcion(this.data.id,this.formularioForm.value).subscribe(
        response => {
          //console.log(response);
          /*this.formularioForm.patchValue({trabajador:'',trabajador_id:'',clues:'', fecha_oficio:'', fecha_cambio:''});
          this.clues_nominal = "";
          this.cr_nominal = "";*/
          this.isLoading = false;
          this.sharedService.showSnackBar("SE GUARDO CORRECTAMENTE", null, 3000);
        },
        errorResponse =>{
          this.isLoading = false;
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        }
      );
    }else{
      this.adscripcionService.guardarAdscripcion(this.formularioForm.value).subscribe(
        response => {
          //console.log(response);
          this.formularioForm.patchValue({trabajador:'',trabajador_id:'',clues:'', fecha_oficio:'', fecha_cambio:''});
          this.clues_nominal = "";
          this.cr_nominal = "";
          this.isLoading = false;
          this.sharedService.showSnackBar("SE GUARDO CORRECTAMENTE", null, 3000);
        },
        errorResponse =>{
          this.isLoading = false;
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        }
      );
    }
    
  }

  cerrar()
  {
    this.dialogRef.close();
  }
}
