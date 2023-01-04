import { Component, OnInit, Inject } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ReincorporacionService } from '../reincorporacion.service';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface RegistroData {
  id: number;
  trabajador_id?:number;
  destino?:any;
  fecha_oficio?:string;
  fecha_cambio?:string;
  fecha_fin?:string;
  trabajador:any;
  catalogo_cr:any;
  clues_adscripcion?:any;
  clues?:any;
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
  arreglo_presentarse:any =
  [
    {id: 27854, nombre:"JOSE DEL CARMEN", apellido_paterno:"TOLEDO", apellido_materno: "ALEJANDRO"},
    {id: 24598, nombre:"ERNESTO", apellido_paterno:"MALO", apellido_materno: "SOLIS"},
  ]
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
    public reincorporacionService:ReincorporacionService
    ) { }

  public formularioForm = this.fb.group({
   
    'trabajador': [''],
    'folio': ['',[Validators.required]],
    'fecha_oficio': ['',[Validators.required]],
    'fecha_cambio': ['',[Validators.required]],
    'trabajador_id': ['',[Validators.required]],
    'clues': ['',[Validators.required]],
    //'reingenieria': ['',[Validators.required]],
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
          clues:this.data.destino, 
          fecha_oficio:this.data.fecha_oficio+"T18:51:49.313Z", 
          fecha_cambio:this.data.fecha_cambio+"T18:51:49.313Z",
          trabajador_id: this.data.trabajador.id,
          //reingenieria: this.data.reingenieria
        });
        
        this.clues_nominal = this.data.clues.clues.clues+" "+this.data.clues.descripcion_actualizada;
        this.cr_nominal = this.data.clues.cr+" "+this.data.clues.descripcion_actualizada
      }
  }

  public buscarTrabajador()
  {
    this.arreglo_trabajador = [];
    this.buscador = true;
    this.reincorporacionService.getTrabajador({busqueda_empleado: this.formularioForm.controls['trabajador'].value}).subscribe(
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
      this.reincorporacionService.editar(this.data.id,this.formularioForm.value).subscribe(
        response => {
          this.isLoading = false;
          this.sharedService.showSnackBar("SE GUARDO CORRECTAMENTE", null, 3000);
          this.cerrar();
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
      this.reincorporacionService.guardar(this.formularioForm.value).subscribe(
        response => {
          this.formularioForm.patchValue({trabajador:'',trabajador_id:'',clues:'', fecha_oficio:'', fecha_cambio:''});
          this.isLoading = false;
          this.sharedService.showSnackBar("SE GUARDO CORRECTAMENTE", null, 3000);
        },
        errorResponse =>{
          this.isLoading = false;
          var errorMessage = "Ocurrió un error.";
          this.sharedService.showSnackBar(errorResponse.error.message, null, 3000);
        }
      );
    }
    
  }

  cerrar()
  {
    this.dialogRef.close();
  }

}
