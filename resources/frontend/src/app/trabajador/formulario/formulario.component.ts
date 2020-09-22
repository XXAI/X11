import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { TrabajadorService } from '../trabajador.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map, throwIfEmpty, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { BREAKPOINT } from '@angular/flex-layout';
import { IfHasPermissionDirective } from 'src/app/shared/if-has-permission.directive';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  catalogo:any = [];
  municipioIsLoading: boolean = false;
  filteredMunicipio: Observable<any[]>;
  objeto_puente: Observable<any[]>;
  capacitacionIsLoading: boolean = false;
  filteredCapacitacion: Observable<any[]>;
  institucionIsLoading: boolean = false;
  filteredInstitucion: Observable<any[]>;
  carreraIsLoading: boolean = false;
  filteredCarrera: Observable<any[]>;
  institucionCicloIsLoading: boolean = false;
  filteredInstitucionCiclo: Observable<any[]>;
  colegioIsLoading: boolean = false;
  filteredColegio: Observable<any[]>;
  freitag:boolean =true;

  constructor(
    private sharedService: SharedService, 
    private trabajadorService: TrabajadorService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }
  
  extrangero:boolean = false;
  trabajadorForm = this.fb.group({
   
    'nombre': ['',[Validators.required]],
    'apellido_paterno': [''],
    'apellido_materno': [''],
    'rfc': ['',[Validators.required]],
    'curp': ['',[Validators.required]],
    'pais_nacimiento_id': ['',[Validators.required]],
    'entidad_nacimiento_id': ['',[Validators.required]],
    'municipio': [''],
    'municipio_nacimiento_id': ['',[Validators.required]],
    'nacionalidad_id': ['', { disabled: this.extrangero}, [Validators.required]],
    'fecha_nacimiento': ['',[Validators.required]],
    'edad': ['',[Validators.required]],
    'estado_conyugal_id': ['',[Validators.required]],
    'sexo': ['',[Validators.required]],
    'telefono_fijo': ['',[Validators.required]],
    'telefono_celular': ['',[Validators.required]],
    'correo_electronico': ['',[Validators.required, Validators.email]],
    'calle': ['',[Validators.required]],
    'no_interior': [''],
    'no_exterior': ['',[Validators.required]],
    'colonia': ['',[Validators.required]],
    'cp': ['',[Validators.required]],
    
    //Datos laborales
    'actividad_id': [],
    'actividad_voluntaria_id': [],
    'area_trabajo_id': [],
    'tipo_personal_id': [],
    'actividad': [],
    'codigo_puesto_id': [],
    'num_empleado': [],
    'fissa': [],
    'figf': [],
    'entidad_federativa_puesto_id': [],
    'tipo_contrato_id': [],
    'tipo_plaza_id': [],
    'unidad_administadora_id': [],
    'institucion_puesto_id': [],
    'vigencia_id': [],
    'motivo_id': [],
    'temporalidad_id': [],
    'seguro_salud': [],
    'licencia_maternidad': [],
    'seguro_retiro': [],
    'jornada_id': [],
    'recurso_formacion': [],
    'tiene_fiel': [],
    'vigencia_fiel': [],
    'comision': [],
    'tipo_comision_id': [],
    'ur': [],
    'tipo_nomina_id': [],
    'programa_id': [],
    'fuente_id': [],
    'fuente_finan_id': [],
    'actividades': [],
    'rama_id': [],
    //Datos escolares
    'nivel_maximo_id':[],

    //Horarios
    'horario_lunes':[], 
    'horario_martes':[], 
    'horario_miercoles':[], 
    'horario_jueves':[], 
    'horario_viernes':[], 
    'horario_sabado':[], 
    'horario_domingo':[], 
    'horario_festivo':[], 
    'hora_inicio_lunes':[], 
    'hora_fin_lunes':[], 
    'hora_inicio_martes':[], 
    'hora_fin_martes':[], 
    'hora_inicio_miercoles':[], 
    'hora_fin_miercoles':[], 
    'hora_inicio_jueves':[], 
    'hora_fin_jueves':[], 
    'hora_inicio_viernes':[], 
    'hora_fin_viernes':[], 
    'hora_inicio_sabado':[], 
    'hora_fin_sabado':[], 
    'hora_inicio_domingo':[], 
    'hora_fin_domingo':[], 
    'hora_inicio_festivo':[], 
    'hora_fin_festivo':[], 

    //Cursos
    'tipo_ciclo_formacion_id':[],
    'carrera_ciclo':[],
    'carrera_ciclo_id':[],
    'institucion_ciclo':[],
    'institucion_ciclo_id':[],
    'anio_cursa_id':[],
    'colegiacion':[],
    'colegio':[],
    'colegio_id':[],
    'certificacion':[],
    'certificacion_id':[],
    'consejo':[],
    'idioma_id':[],
    'nivel_idioma_id':[],
    'lengua_indigena_id':[],
    'nivel_lengua_id':[],
    'lenguaje_senias':[],

    //capacitacion
    'capacitacion_anual':[],
    'grado_academico_id':[],
    'titulo_capacitacion':[],
    'titulo_diploma_id':[],
    'otro_nombre_titulo':[],
    'institucion':[],
    'institucion_id':[],
    'otro_nombre_institucion':[],
    'ciclo_id':[],


  });

  displayedColumns: string[] = ['tipo','descripcion','institucion','cedula','actions'];
  displayedColumnsCursos: string[] = ['entidad','nombre_curso','actions'];
  dataSource: any = [];
  dataSourceCapacitacion: any = [];
  

  ngOnInit() {
    this.cargarDatosDefault();
    this.cargarCatalogos();

    this.cargarBuscadores();
    
  }

  cargarBuscadores():void
  {
      this.trabajadorForm.get('municipio').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.municipioIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.municipioIsLoading = false;
              let entidad = this.trabajadorForm.get('entidad_nacimiento_id').value;
              let municipio = this.trabajadorForm.get('municipio').value;
              if( entidad != '' && municipio!="")
              {
                return this.trabajadorService.buscar({tipo:1, query:value, entidad_nacimiento:entidad }).pipe(finalize(() => this.municipioIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.municipioIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredMunicipio = items);
    
      this.trabajadorForm.get('titulo_capacitacion').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.capacitacionIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.capacitacionIsLoading = false; 
              let grado = this.trabajadorForm.get('grado_academico_id').value;
              let descripcion = this.trabajadorForm.get('titulo_capacitacion').value;
              if( grado != '' && descripcion!="")
              {
                console.log("entra");
                return this.trabajadorService.buscar({tipo: 2, query:value, grado_academico:grado }).pipe(finalize(() => this.capacitacionIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.capacitacionIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredCapacitacion = items);
      
      this.trabajadorForm.get('institucion').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.institucionIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.institucionIsLoading = false; 
              let descripcion = this.trabajadorForm.get('institucion').value;
              if( descripcion!="")
              {
               
                return this.trabajadorService.buscar({tipo: 3, query:value}).pipe(finalize(() => this.institucionIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.institucionIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredInstitucion = items);

      this.trabajadorForm.get('carrera_ciclo').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.carreraIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.carreraIsLoading = false; 
              let descripcion = this.trabajadorForm.get('carrera_ciclo').value;
              if(descripcion!="")
              {
                console.log("entra");
                return this.trabajadorService.buscar({tipo: 4, query:value }).pipe(finalize(() => this.carreraIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.carreraIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredCarrera = items);

      this.trabajadorForm.get('institucion_ciclo').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.institucionCicloIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.institucionCicloIsLoading = false; 
              let descripcion = this.trabajadorForm.get('institucion_ciclo').value;
              if( descripcion!="")
              {
               
                return this.trabajadorService.buscar({tipo: 5, query:value}).pipe(finalize(() => this.institucionCicloIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.institucionCicloIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredInstitucionCiclo = items);
      
      this.trabajadorForm.get('colegio').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.colegioIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.colegioIsLoading = false; 
              let descripcion = this.trabajadorForm.get('colegio').value;
              if( descripcion!="")
              {
               
                return this.trabajadorService.buscar({tipo: 6, query:value}).pipe(finalize(() => this.colegioIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.colegioIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredColegio = items);
    
  }

  cargarDatosDefault():void{
    let datos = {seguro_salud: 1, licencia_maternidad: 0, seguro_retiro: 0, recurso_formacion:0, tiene_fiel:1};
    this.trabajadorForm.patchValue(datos);
  }

  cargarCatalogos():void{
    
    this.trabajadorService.getCatalogos().subscribe(
      response =>{

        this.catalogo = response.data;

      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
  }

  verificar_curp(curp):void
  {
    if(curp.length == 18)
    {
      this.trabajadorForm.patchValue({rfc: curp.substring(0, 10)}); 
      let sexo = curp.substring(10,11);
      let estado = curp.substring(11,13);
      let fecha_nacimiento = curp.substring(4,10);
      
      let anio = fecha_nacimiento.substring(0,2);
      let mes = fecha_nacimiento.substring(2,4);
      let dia = fecha_nacimiento.substring(4,6);
      
      this.trabajadorForm.patchValue({fecha_nacimiento: new Date(anio+"-"+mes+"-"+dia)}); 
      
      if(sexo == "H")
      {
        this.trabajadorForm.patchValue({sexo: 1});
      }else if(sexo == "M")
      {
          this.trabajadorForm.patchValue({sexo: 2});
      }
      if(estado == "NE")
      {
        this.extrangero = false;
        this.trabajadorForm.patchValue({nacionalidad_id: 2, entidad_nacimiento_id:2499 });
        
      }else{
        this.extrangero = false;
        this.trabajadorForm.patchValue({nacionalidad_id: 1, pais_nacimiento_id:142, entidad_nacimiento_id:7});
      }
    }
  }

  displayMunicipioFn(item: any) {
    if (item) { return item.descripcion; }
  }
  
  displayCapacitacionFn(item: any) {
    if (item) { return item.descripcion; }
  }

  displayInstitucionFn(item: any) {
    if (item) { return item.descripcion; }
  }
  
  displayCarreraFn(item: any) {
    if (item) { return item.descripcion; }
  }

  displayInstitucionCicloFn(item: any) {
    if (item) { return item.descripcion; }
  }
  
  displayColegioFn(item: any) {
    if (item) { return item.descripcion; }
  }
}
