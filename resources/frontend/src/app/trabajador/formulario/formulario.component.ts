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
import { BREAKPOINT, validateBasis } from '@angular/flex-layout';
import { IfHasPermissionDirective } from 'src/app/shared/if-has-permission.directive';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MediaObserver } from '@angular/flex-layout';
import { MatTableDataSource } from '@angular/material';

/* Utilerias */


/*Dialogs */
import { JornadaDialogComponent } from '../jornada-dialog/jornada-dialog.component';
import { EstudiosDialogComponent } from '../estudios-dialog/estudios-dialog.component';
import { CapacitacionDialogComponent } from '../capacitacion-dialog/capacitacion-dialog.component';
import { ComisionDialogComponent } from '../comision-dialog/comision-dialog.component';
import { BajaDialogComponent } from '../baja-dialog/baja-dialog.component';


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
  mediaSize: string;
  datosEstudios:any = [];
  datosCapacitacion:any = [];
  datosComision:any = null;

  trabajador_id:string;
  nombre_trabajador:string;

  constructor(
    private sharedService: SharedService, 
    private trabajadorService: TrabajadorService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver
  ) { }
  
  public trabajadorForm = this.fb.group({
   
    'nombre': ['',[Validators.required]],
    'apellido_paterno': [''],
    'apellido_materno': [''],
    'rfc': ['',[Validators.required, Validators.minLength(13)]],
    'curp': ['',[Validators.required, Validators.minLength(18)]],
    'pais_nacimiento_id': ['',[Validators.required]],
    'entidad_nacimiento_id': ['',[Validators.required]],
    'municipio': [{ value:'', disabled:true}, Validators.required],
    'municipio_nacimiento_id': ['', [Validators.required]],
    'nacionalidad_id': ['',[Validators.required]],
    'fecha_nacimiento': ['',[Validators.required]],
    //'edad': ['',[Validators.required]],
    'estado_conyugal_id': ['',[Validators.required]],
    'sexo': ['',[Validators.required]],
    'telefono_fijo': ['',],
    'telefono_celular': ['',[Validators.required,, Validators.minLength(10)]],
    'correo_electronico': ['',[Validators.required, Validators.email]],
    'calle': ['',[Validators.required]],
    'no_interior': [''],
    'no_exterior': ['',[Validators.required]],
    'colonia': ['',[Validators.required]],
    'cp': ['',[Validators.required]],
    'observacion': ['',]
  });

  public datosLaborelesForm = this.fb.group({
    //Datos laborales
    'fecha_ingreso': [],
    'fecha_ingreso_federal': [],
    'codigo_puesto_id': [],
    'rama_id': [],

    'actividad_id': [],
    'actividad_voluntaria_id': [],
    'area_trabajo_id': [],
    'tipo_personal_id': [],
    
    'unidad_administadora_id': [],
    'seguro_salud': [],
    'licencia_maternidad': [],
    'seguro_retiro': [],

    'programa_id': [],
    'recurso_formacion': [],
    'tiene_fiel': [],
    'vigencia_fiel': [{ value:'', disabled:true}, Validators.required],
    //'ur': [],
    'actividades': [],
  });
  
  public datosEscolaresForm = this.fb.group({
    //Estudios
    'nivel_maximo_id':[],

  });

  public datosHorarioForm = this.fb.group({
    //Horarios
    'jornada_id': [],
    'horario_lunes':[], 
    'horario_martes':[], 
    'horario_miercoles':[], 
    'horario_jueves':[], 
    'horario_viernes':[], 
    'horario_sabado':[], 
    'horario_domingo':[], 
    'horario_festivo':[], 
    'hora_inicio_lunes':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_lunes':[{ value:'', disabled:true}, Validators.required], 
    'hora_inicio_martes':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_martes':[{ value:'', disabled:true}, Validators.required], 
    'hora_inicio_miercoles':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_miercoles':[{ value:'', disabled:true}, Validators.required], 
    'hora_inicio_jueves':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_jueves':[{ value:'', disabled:true}, Validators.required], 
    'hora_inicio_viernes':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_viernes':[{ value:'', disabled:true}, Validators.required], 
    'hora_inicio_sabado':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_sabado':[{ value:'', disabled:true}, Validators.required], 
    'hora_inicio_domingo':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_domingo':[{ value:'', disabled:true}, Validators.required], 
    'hora_inicio_festivo':[{ value:'', disabled:true}, Validators.required], 
    'hora_fin_festivo':[{ value:'', disabled:true}, Validators.required], 
  });
  public datosCursosForm = this.fb.group({
    //Cursos
    'tipo_ciclo_formacion_id':[],
    'carrera_ciclo':[],
    'carrera_ciclo_id':[],
    'institucion_ciclo':[],
    'institucion_ciclo_id':[],
    'anio_cursa_id':[],
    'colegiacion':[],
    'colegio':[{ value:'', disabled:true}, Validators.required],
    'colegio_id':[],
    'certificacion':[],
    'certificacion_id':[{ value:'', disabled:true}, Validators.required],
    'consejo':[],
    'idioma_id':[],
    'nivel_idioma_id':[],
    'lengua_indigena_id':[],
    'nivel_lengua_id':[],
    'lenguaje_senias':[],
  });

  public datosCapacitacionForm = this.fb.group({
    //capacitacion
    'capacitacion_anual':['', [Validators.required]],
    'grado_academico_id':[{ value:'', disabled:true}, Validators.required],
    'titulo_capacitacion':[{ value:'', disabled:true}, Validators.required],
    'titulo_diploma_id':[{ value:'', disabled:true}, Validators.required],
    'otro_nombre_titulo':[{ value:'', disabled:true}, Validators.required],
    'institucion':[{ value:'', disabled:true}, Validators.required],
    'institucion_id':[],
    'otro_nombre_institucion':[{ value:'', disabled:true}, Validators.required],
    'ciclo_id':[{ value:'', disabled:true}, Validators.required],


  });

  displayedColumns: string[] = ['tipo','descripcion','institucion','cedula','actions'];
  displayedColumnsCursos: string[] = ['entidad','nombre_curso','actions'];
  dataSourceEstudios:any = new MatTableDataSource(this.datosEstudios);
  dataSourceCapacitacion:any = new MatTableDataSource(this.datosCapacitacion);

  ngOnInit() {
    this.cargarDatosDefault();
    this.cargarCatalogos();
    this.cargarBuscadores();
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    this.route.paramMap.subscribe(params => {
      this.trabajador_id = params.get('id');

      if(this.trabajador_id){
        this.cargarTrabajador(this.trabajador_id);
      }
    });
  }

  cargarTrabajador(id):void{
    
    this.trabajadorService.buscarTrabajador(id, {}).subscribe(
      response =>{
        //console.log(response);
        let trabajador = response;
        
        this.verificar_curp(trabajador.curp);
        this.nombre_trabajador= trabajador.apellido_paterno+" "+trabajador.apellido_materno+" "+trabajador.nombre;
        this.trabajadorForm.patchValue(trabajador);

        this.trabajadorForm.patchValue({municipio: trabajador.municipio_nacimiento});
        /* Fech de ingreso */
        console.log(trabajador.datoslaborales);
        let ingreso;
        this.datosLaborelesForm.patchValue(trabajador.datoslaborales);
        let datos_laborales = trabajador.datoslaborales;
        let anio = datos_laborales.fecha_ingreso.substring(0,4);
        let mes = parseInt(datos_laborales.fecha_ingreso.substring(5,7));
        let dia = parseInt(datos_laborales.fecha_ingreso.substring(8,10));
        ingreso = new Date(anio+"-"+mes+"-"+dia);

        let ingreso_federal;
        let anio_federal = datos_laborales.fecha_ingreso_federal.substring(0,4);
        let mes_federal = parseInt(datos_laborales.fecha_ingreso_federal.substring(5,7));
        let dia_federal = parseInt(datos_laborales.fecha_ingreso_federal.substring(8,10));
        ingreso_federal = new Date(anio_federal+"-"+mes_federal+"-"+dia_federal);
        
        this.datosLaborelesForm.patchValue({fecha_ingreso: ingreso, fecha_ingreso_federal: ingreso_federal}); 
        this.datosLaborelesForm.patchValue( {seguro_salud: 1, licencia_maternidad: 0, seguro_retiro: 0, recurso_formacion:0, tiene_fiel:0});
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
    
      /*this.trabajadorForm.get('titulo_capacitacion').valueChanges
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
      ).subscribe(items => this.filteredColegio = items);*/
    
  }

  cargarDatosDefault():void{
    let datos = { colegiacion:0, certificacion:0, capacitacion_anual:0};
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
/*Funciones de formulario */

  verificar_curp(curp):void
  {
    if(curp.length == 18)
    {
      let rfc = this.trabajadorForm.get('rfc').value;
      console.log(rfc);
      if(rfc.length == 0)
      {
        this.trabajadorForm.patchValue({rfc: curp.substring(0, 10)}); 
      }

      
      let sexo = curp.substring(10,11);
      let estado = curp.substring(11,13);
      let fecha_nacimiento = curp.substring(4,10);
      
      let anio = fecha_nacimiento.substring(0,2);
      let mes = parseInt(fecha_nacimiento.substring(2,4));
      let dia = parseInt(fecha_nacimiento.substring(4,6));
      
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
        this.trabajadorForm.get('municipio').disable();
        this.trabajadorForm.patchValue({nacionalidad_id: 2, entidad_nacimiento_id:2499 });
        
      }else{
        this.trabajadorForm.get('municipio').enable();
        this.trabajadorForm.patchValue({nacionalidad_id: 1, pais_nacimiento_id:142, entidad_nacimiento_id:7});

      }
    }
  }

  accionGuardar(tipo:number):void{
    let data;
    
    if(tipo == 1)
    {
      data = this.trabajadorForm.value;
      data.municipio_nacimiento_id = data.municipio.id;
    }else if(tipo == 2)
    {
      data = this.datosLaborelesForm.value;
      data.municipio_nacimiento_id = data.municipio.id;
    }


    //data.trabajador_id = this.trabajador_id;
    data.tipo_dato = tipo;
    console.log(data); 
    this.trabajadorService.guardarTrabajador(this.trabajador_id, data).subscribe(
      response =>{
        //console.log(response);
        this.sharedService.showSnackBar("Se ha Guardado Correctamente", null, 3000);
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
        
      }
    );
  }

  showJornadaDialog(){
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize}
      };
    }else{
      configDialog = {
        width: '50%',
        data:{}
      }
    }
    const dialogRef = this.dialog.open(JornadaDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        if(valid.estatus){
          for (let index = 0; index < valid.dias.length; index++) {
            this.jornada(valid.dias[index], false, valid.datos.hora_inicio, valid.datos.hora_fin); 
          }
        }
      }
    });
  }

  showEstudiosDialog(index_editable = null){
    let configDialog = {};
    let index = index_editable;
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, catalogos: this.catalogo['grado_academico'], editable: this.datosEstudios[index_editable] },
      };
    }else{
      
      configDialog = {
        width: '95%',
        data:{ catalogos: this.catalogo['grado_academico'], editable: this.datosEstudios[index_editable] },
      }
    }
    const dialogRef = this.dialog.open(EstudiosDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        if(valid.estatus){
          console.log(index);
          if(index != null)
          {
            this.datosEstudios[index] = valid.datos;  
          }else{
            this.datosEstudios.push(valid.datos);
          }
          this.dataSourceEstudios.data = this.datosEstudios;
          
        }
      }
    });
  }
  
  showCapacitacionDialog(index_editable = null){
    let configDialog = {};
    let index = index_editable;
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, catalogos: this.catalogo['entidad'], editable: this.datosCapacitacion[index_editable] },
      };
    }else{
      
      configDialog = {
        width: '95%',
        data:{ catalogos: this.catalogo['entidad'], editable: this.datosCapacitacion[index_editable] },
      }
    }
    const dialogRef = this.dialog.open(CapacitacionDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        if(valid.estatus){
          if(index != null)
          {
            this.datosCapacitacion[index] = valid.datos;  
          }else{
            this.datosCapacitacion.push(valid.datos);
          }
          //console.log(this.datosCapacitacion);
          this.dataSourceCapacitacion.data = this.datosCapacitacion;
        }
      }
    });
  }

  showComisionDialog(){
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, catalogos: this.catalogo['entidad'] },
      };
    }else{
      
      configDialog = {
        width: '95%',
        data:{ catalogos: this.catalogo['entidad'] },
      }
    }
    const dialogRef = this.dialog.open(ComisionDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        if(valid.estatus){
          this.datosComision = valid.datos;
          console.log(this.datosComision);
        }
      }
    });
  }

  showBajaDialog(){
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize },
      };
    }else{
      
      configDialog = {
        width: '95%',
        data:{  },
      }
    }
    const dialogRef = this.dialog.open(BajaDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.sharedService.showSnackBar("Se ha dado de Baja el trabajador", null, 3000);
        /* Aqui debe de estar el proceso de bloque para que no se pueda editar nada mas */
      }
    });
  }


  /* Activadores functions */
  fiel(valor):void{
    if(valor == '0')
    {
      this.datosLaborelesForm.get('vigencia_fiel').disable();
    }else if(valor == '1')
    {
      this.datosLaborelesForm.get('vigencia_fiel').enable();
    }
  }
  
  tiene_capacitacion(valor):void{
    if(valor == '0')
    {
      this.trabajadorForm.get('grado_academico_id').disable();
      this.trabajadorForm.get('titulo_capacitacion').disable();
      this.trabajadorForm.get('otro_nombre_titulo').disable();
      this.trabajadorForm.get('institucion').disable();
      this.trabajadorForm.get('otro_nombre_institucion').disable();
      this.trabajadorForm.get('ciclo_id').disable();
    }else if(valor == '1')
    {
      this.trabajadorForm.get('grado_academico_id').enable();
      this.trabajadorForm.get('titulo_capacitacion').enable();
      this.trabajadorForm.get('otro_nombre_titulo').enable();
      this.trabajadorForm.get('institucion').enable();
      this.trabajadorForm.get('otro_nombre_institucion').enable();
      this.trabajadorForm.get('ciclo_id').enable();
    }
  }

  tiene_colegio(valor):void{
    if(valor == '0')
    {
      this.trabajadorForm.get('colegio').disable();
    }else if(valor == '1')
    {
      this.trabajadorForm.get('colegio').enable();
    }
  }

  tiene_certificado(valor):void{
    if(valor == '0')
    {
      this.trabajadorForm.get('certificacion_id').disable();
    }else if(valor == '1')
    {
      this.trabajadorForm.get('certificacion_id').enable();
    }
  }

  jornada(key, valor, inicio:any = null, fin:any = null)
  {
    switch (key) {
      case 1:
        if(valor){
          this.trabajadorForm.get('hora_inicio_lunes').disable();
          this.trabajadorForm.get('hora_fin_lunes').disable();
          this.trabajadorForm.patchValue({hora_inicio_lunes: inicio, hora_fin_lunes: fin} );
          
        }else{
          this.trabajadorForm.get('hora_inicio_lunes').enable();
          this.trabajadorForm.get('hora_fin_lunes').enable();
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_lunes: true});
            this.trabajadorForm.patchValue({hora_inicio_lunes: inicio, hora_fin_lunes: fin} );
          }
        }  
      break;
      case 2:
        if(valor){
          this.trabajadorForm.get('hora_inicio_martes').disable();
          this.trabajadorForm.get('hora_fin_martes').disable();
          this.trabajadorForm.patchValue({hora_inicio_martes: inicio, hora_fin_martes: fin} );
        }else{
          this.trabajadorForm.get('hora_inicio_martes').enable();
          this.trabajadorForm.get('hora_fin_martes').enable();
          
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_martes: true});
            this.trabajadorForm.patchValue({hora_inicio_martes: inicio, hora_fin_martes: fin} );
          }
        }  
      break;
      case 3:
        if(valor){
          this.trabajadorForm.get('hora_inicio_miercoles').disable();
          this.trabajadorForm.get('hora_fin_miercoles').disable();
          this.trabajadorForm.patchValue({hora_inicio_miercoles: inicio, hora_fin_miercoles: fin} );
        }else{
          this.trabajadorForm.get('hora_inicio_miercoles').enable();
          this.trabajadorForm.get('hora_fin_miercoles').enable();
          
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_miercoles: true});
            this.trabajadorForm.patchValue({hora_inicio_miercoles: inicio, hora_fin_miercoles: fin} );
          }
        }  
      break;
      case 4:
        if(valor){
          this.trabajadorForm.get('hora_inicio_jueves').disable();
          this.trabajadorForm.get('hora_fin_jueves').disable();
          this.trabajadorForm.patchValue({hora_inicio_jueves: inicio, hora_fin_jueves: fin} );
        }else{
          this.trabajadorForm.get('hora_inicio_jueves').enable();
          this.trabajadorForm.get('hora_fin_jueves').enable();
          
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_jueves: true});
            this.trabajadorForm.patchValue({hora_inicio_jueves: inicio, hora_fin_jueves: fin} );
          }
        }  
      break;
      case 5:
        if(valor){
          this.trabajadorForm.get('hora_inicio_viernes').disable();
          this.trabajadorForm.get('hora_fin_viernes').disable();
          this.trabajadorForm.patchValue({hora_inicio_viernes: inicio, hora_fin_viernes: fin} );
        }else{
          this.trabajadorForm.get('hora_inicio_viernes').enable();
          this.trabajadorForm.get('hora_fin_viernes').enable();
          
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_viernes: true});
            this.trabajadorForm.patchValue({hora_inicio_viernes: inicio, hora_fin_viernes: fin} );
          }
        }  
      break;
      case 6:
        if(valor){
          this.trabajadorForm.get('hora_inicio_sabado').disable();
          this.trabajadorForm.get('hora_fin_sabado').disable();
          this.trabajadorForm.patchValue({hora_inicio_sabado: inicio, hora_fin_sabado: fin} );
        }else{
          this.trabajadorForm.get('hora_inicio_sabado').enable();
          this.trabajadorForm.get('hora_fin_sabado').enable();
          
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_sabado: true});
            this.trabajadorForm.patchValue({hora_inicio_sabado: inicio, hora_fin_sabado: fin} );
          }
        }  
      break;
      case 7:
        if(valor){
          this.trabajadorForm.get('hora_inicio_domingo').disable();
          this.trabajadorForm.get('hora_fin_domingo').disable();
          this.trabajadorForm.patchValue({hora_inicio_domingo: inicio, hora_fin_domingo: fin} );
        }else{
          this.trabajadorForm.get('hora_inicio_domingo').enable();
          this.trabajadorForm.get('hora_fin_domingo').enable();
          
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_domingo: true});
            this.trabajadorForm.patchValue({hora_inicio_domingo: inicio, hora_fin_domingo: fin} );
          }
        }  
      break;
      case 8:
        if(valor){
          this.trabajadorForm.get('hora_inicio_festivo').disable();
          this.trabajadorForm.get('hora_fin_festivo').disable();
          this.trabajadorForm.patchValue({hora_inicio_festivo: inicio, hora_fin_festivo: fin} );
        }else{
          this.trabajadorForm.get('hora_inicio_festivo').enable();
          this.trabajadorForm.get('hora_fin_festivo').enable();
          
          if(inicio != null && fin != null)
          {
            this.trabajadorForm.patchValue({horario_festivo: true});
            this.trabajadorForm.patchValue({hora_inicio_festivo: inicio, hora_fin_festivo: fin} );
          }
        }  
      break;
    }
  }

  eliminarEstudio(index)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Eliminar Estudio',dialogMessage:'¿Realmente desea eliminar el estudio?',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.datosEstudios.splice(index, 1);
        this.dataSourceEstudios.data = this.datosEstudios;
      }
    });
  }
  
  eliminarCapacitacion(index)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Eliminar Capacitación',dialogMessage:'¿Realmente desea eliminar el curso?',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.datosCapacitacion.splice(index, 1);
        this.dataSourceCapacitacion.data = this.datosCapacitacion;
      }
    });
  }

  /* Displays functions */
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
