import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { CluesService } from '../../clues.service';
import { ServicioService } from '../servicio.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  cr:string = "";
  estatus_clues:boolean = false;
  datos_clues:any;

  puedeGuardar: boolean = true;
  puedeValidar: boolean = true;
  puedeTransferir: boolean = true;
  necesitaActivarse: boolean = false;
  statusLabel: string;
  statusIcon: string;
  filteredCatalogs:any = {};
  filterCatalogs:any = {};

  catalogoClasificacion:any;

  responsableIsLoading: boolean = false;
  filteredResponsable: Observable<any[]>;

  catalogoDistritos: object = [
    { id: 1, descripcion: 'TUXTLA GUTIERREZ'},
    { id: 2, descripcion: 'SAN CRISTOBAL'},
    { id: 3, descripcion: 'COMITAN DE DOMINGUEZ'},
    { id: 4, descripcion: 'VILLAFLORES'},
    { id: 5, descripcion: 'PICHUCALCO'},
    { id: 6, descripcion: 'PALENQUE'},
    { id: 7, descripcion: 'TAPACHULA'},
    { id: 8, descripcion: 'TONALA'},
    { id: 9, descripcion: 'OCOSINGO'},
    { id: 10, descripcion: 'MOTOZINTLA'},
    { id: 11, descripcion: 'OFICINA CENTRAL'}];
  
  constructor(
    private sharedService: SharedService, 
    private cluesService: CluesService,
    private servicioService: ServicioService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  isLoading:boolean = false;
  
  cluesForm = this.fb.group({
    'tipo_unidad': ['',Validators.required],
    'cve_jurisdiccion': ['',Validators.required],
    'clues': ['',Validators.required],
    'cr': ['',Validators.required],
    'clasificacion': ['',Validators.required],
    //'tipo_unidad': ['',Validators.required],
    'descripcion': ['',Validators.required],
    'ze': ['',Validators.required],
    'municipio': ['',Validators.required],
    'telefono': ['',Validators.required],
    'direccion': ['',Validators.required],
    'cr_dependencia': ['',Validators.required],
    
  });

  ngOnInit() {
    this.cargarCatalogos();
    
  }

  cargarCatalogos()
  {

    this.servicioService.getClasificacion().subscribe(
      respuesta => {
        this.catalogoClasificacion = respuesta;
        this.route.paramMap.subscribe(params => {
          this.cr = params.get('id');
  
          if(this.cr){
            this.loadCluesData(this.cr);
          }
        });
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }else{
          errorMessage += ': ' + errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    this.loadFilterCatalogs();
    
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  public loadFilterCatalogs(){
    this.servicioService.getFilterCatalogs().subscribe(
      response => {
        this.filterCatalogs = {
          'cr': response.data.cr,
        };
        
        this.filteredCatalogs['cr'] = this.cluesForm.controls['cr_dependencia'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'cr','descripcion')));
        
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
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

  loadCluesData(id:any)
  {
    this.isLoading = true;
    let params = {};

    this.cluesService.obtenerDatosClues(id,params).subscribe(
      response =>{
        this.cluesForm.reset();

        if(typeof response === 'object'){
          
          //Construccion de datos para el formulario
          let datos = response.data;
          this.cluesForm.patchValue(
            {
              tipo_unidad: parseInt(datos.registrada),
              cve_jurisdiccion: parseInt(datos.clues.cve_jurisdiccion),
              clasificacion: datos.clues.clasificacion_descripcion,
              clues:datos.clues.clues,
              cr:datos.cr,
              descripcion: datos.descripcion_actualizada,
              direccion: datos.direccion,
              ze: parseInt(datos.ze),
              municipio: datos.municipio,
              telefono: datos.telefono,
              cr_dependencia: datos.dependencia,
            }
          );
          
          
        }
        this.isLoading = false;
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }

  displayResponsableFn(item: any) {
    if (item) { return item.nombre; }
  }

  accionGuardar(validar:boolean = false){
    this.isLoading = true;
    let formData = JSON.parse(JSON.stringify(this.cluesForm.value));
    //console.log(formData);
    /*if(formData.responsable)
    {
      formData.responsable_id = formData.responsable.id;
    }

    delete formData.responsable;*/
    
    if(this.cr != null)
    {
      this.cluesService.actualizarClues(this.cr, formData).subscribe(
        respuesta => {
          this.isLoading = false;
          this.sharedService.showSnackBar("Se ha guardado correctamente", "Correcto", 3000);
        },
        errorResponse =>{
          console.log(errorResponse);
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }else{
            errorMessage += ': ' + errorResponse.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
          this.isLoading = false;
        }
      );
    }else{
      this.cluesService.creatUnidad(formData).subscribe(
        respuesta => {
          this.isLoading = false;
          this.sharedService.showSnackBar("Se ha guardado correctamente", "Correcto", 3000);
        },
        errorResponse =>{
          console.log(errorResponse);
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }else{
            errorMessage += ': ' + errorResponse.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
          this.isLoading = false;
        }
      );
    }
    

  }
}
