import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { BajaDialogComponent } from '../baja-dialog/baja-dialog.component';
import { ComisionDialogComponent } from '../comision-dialog/comision-dialog.component';
import { EstudiosDialogComponent } from '../estudios-dialog/estudios-dialog.component';
/* Utilerias */
/*Dialogs */
import { JornadaDialogComponent } from '../jornada-dialog/jornada-dialog.component';
import { TrabajadorService } from '../trabajador.service';
import { ImportarService } from '../../tramites/importar.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  catalogo:any = [];
  catalogosFiscales:any = [];
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
  EstudiosActualizado:number = 0;
  EstudiosRestantes:number = 0;
  mediaSize: string;
  datosEstudios:any = [];
  datosCapacitacion:any = [];
  datosComision:any = null;
  isLoading:boolean = false;
  crIsLoading: boolean = false;
  dias:number = 0;
  datos_laborales:any;
  datos_personales:any = { estatus : 0};
  datos_laborales_nomina:any;
  imagen_trabajador:string = 'assets/trabajador.jpg';
  selectedItemIndex: number = -1;
  isLoadingPage: boolean = true;
  isLoadingCredential: boolean = false;
  actualizado:boolean = false;
  editable = true;
  Actualizado:boolean = false;
  datosFiscales:any;

  filteredCr: Observable<any[]>;
  finalizarActualizacion:boolean = true;
  puedeDesligar:boolean = false;
  informacion:string = "Seleccionar un archivo";

  indexTab:number = 0;

  miniPagination:any;

  trabajador_id:string = "";
  nombre_trabajador:string;
  tab_proceso:number = 1;

  archivo: File = null;
  archivoSubido:boolean;
  enviandoDatos:boolean;
  progreso: number = 0; 
  errorArchivo:boolean;
  descargarConstancia:boolean = false;

  trabajador:any;
  estatusDocumentacion:string[] = ['', 'ENVIADO','RECHAZADO', 'EN VALIDACIÓN', "RECHAZADO", "VALIDADO"];
  estatusChip:number = 0;

  constructor(
    private sharedService: SharedService, 
    private trabajadorService: TrabajadorService,
    private importarService: ImportarService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    public router: Router
  ) { }
  
  public trabajadorForm = this.fb.group({
   
    'nombre': ['',[Validators.required]],
    'apellido_paterno': [''],
    'apellido_materno': [''],
    'rfc': ['',[Validators.required, Validators.minLength(13)]],
    'curp': ['',[Validators.required, Validators.minLength(18)]],
    'pais_nacimiento_id': ['',[Validators.required]],
    'entidad_nacimiento_id': ['',[Validators.required]],
    //'municipio': [{ value:'', disabled:true}, Validators.required],
    'municipio': [],
    //'municipio_nacimiento_id': ['', [Validators.required]],
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
    'observacion': ['',],
    'idioma_id':[],
    'nivel_idioma_id':[{ value:'', disabled:true}, Validators.required],
    'lengua_indigena_id':[],
    'nivel_lengua_id':[{ value:'', disabled:true}, Validators.required],
    'lenguaje_senias':[],
    'cr': ['',[Validators.required]],
    'cr_id': [''],
    'clues': [''],
    'rama_id': ['',],
  });

  public datosLaborelesForm = this.fb.group({
    //Datos laborales
    //'fecha_ingreso': ['',[Validators.required]],
    //'fecha_ingreso_federal': [],
    //'codigo_puesto_id': [],
    'rama_id': ['',[Validators.required]],

    'actividad_id': ['',[Validators.required]],
    'actividad_voluntaria_id': [],
    'area_trabajo_id': ['',[Validators.required]],
    'tipo_personal_id': ['',[Validators.required]],
    
    //'unidad_administradora_id': [],
    'seguro_salud': ['',[Validators.required]],
    'licencia_maternidad': ['',[Validators.required]],
    'seguro_retiro': ['',[Validators.required]],

    //'programa_id': [],
    //'recurso_formacion': [],
    'tiene_fiel': ['',[Validators.required]],
    'vigencia_fiel': [{ value:'', disabled:true}, Validators.required],
    //'ur': [],
    'actividades': ['',[Validators.required]],
    
  });

  public datosFiscalesForm = this.fb.group({
    
    'razon_social': ['',[Validators.required]],
    'tipo_vialidad': [''],
    'nombre_vialidad': ['',[Validators.required]],
    'no_exterior': ['',[Validators.required]],
    'no_interior': [''],
    'colonia': [''],
    'cp': ['',[Validators.required]],
    'localidad': [''],
    'municipio': ['',[Validators.required]],
    'entidad': ['', Validators.required],
    'calle1': [''],
    'calle2': [''],
    'correo': [''],
    'lada': [],
    'telefono': [],
    //'lada2': [],
    //'telefono2': [],
    //'estado_domicilio': [],
    //'estado_contribuyente': [],
    ///'actividad_economina': ['',[Validators.required]],
    //'fecha_inicio_actividad': ['',[Validators.required]],
    'regimen': ['',[Validators.required]],
    'fecha_regimen': ['',[Validators.required]],
    //'documento_digital': ['',[Validators.required]],
    'file': ['', Validators.required],
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
  /*public datosCursosForm = this.fb.group({
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
    
  });

  public datosCapacitacionForm = this.fb.group({
    //capacitacion
    'capacitacion_anual':['', [Validators.required]],
    'grado_academico_id':[{ value:'', disabled:true}, Validators.required],
    'titulo_capacitacion':[{ value:'', disabled:true}, Validators.required],
    'otro_estudio_capacitacion':[],
    'titulo_diploma_id':[{ value:'', disabled:true}, Validators.required],
    'otro_institucion_educativa':[],
    'otro_nombre_titulo':[{ value:'', disabled:true}, Validators.required],
    'institucion':[{ value:'', disabled:true}, Validators.required],
    'institucion_id':[],
    'otro_nombre_institucion':[{ value:'', disabled:true}, Validators.required],
    'ciclo_id':[{ value:'', disabled:true}, Validators.required],
  });*/

  displayedColumns: string[] = ['tipo','descripcion','institucion','cedula','actions'];
  displayedColumnsCursos: string[] = ['entidad','nombre_curso','actions'];
  dataSourceEstudios:any = new MatTableDataSource(this.datosEstudios);
  dataSourceCapacitacion:any = new MatTableDataSource(this.datosCapacitacion);

  ngOnInit() {
    this.miniPagination = {total:0};

    //this.cargarDatosDefault();
    this.cargarCatalogos();
    
    let cargador = true;
    this.trabajadorForm.markAllAsTouched();
    this.trabajadorForm.updateValueAndValidity();
    this.datosLaborelesForm.markAllAsTouched();
    this.datosLaborelesForm.updateValueAndValidity();
    this.datosHorarioForm.markAllAsTouched();
    this.datosHorarioForm.updateValueAndValidity();
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });
    this.isLoadingPage = false;
    this.route.paramMap.subscribe(params => {
      this.trabajador_id = params.get('id');
      
      if(this.trabajador_id){
        this.cargarBuscadores(!cargador);
        this.cargarTrabajador(this.trabajador_id);
        this.trabajadorForm.get("cr").disable();
        if(parseInt(params.get('step')))
        {
          this.avanzar(parseInt(params.get('step')));
        }
        
      }else{
        //this.trabajadorForm.get('rfc').enable();
        this.cargarBuscadores(cargador);
        this.editable = false;
      }
    });
    
  }

  loadNext(){
    let nextId = this.miniPagination.next;
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');

    if(paginator.selectedIndex+1 >= paginator.pageSize){
      paginator.pageIndex += 1;
      paginator.selectedIndex = 0;
    }else{
      paginator.selectedIndex += 1;
    }

    this.sharedService.setDataToCurrentApp('paginator',paginator);
    this.router.navigate(['/trabajadores/editar/'+nextId]);
  }

  verificarNivel(valor)
  {
    switch(valor)
    {
      case 2039842:
        this.EstudiosActualizado = 0; break;
      case 2039843:
        this.EstudiosActualizado = 1; break;
      case 2039846:
        this.EstudiosActualizado = 0; break;
      case 2039847:
        this.EstudiosActualizado = 0; break;
      case 2039848:
        this.EstudiosActualizado = 1; break;
      case 2039849:
        this.EstudiosActualizado = 1; break;
      case 2039850:
        this.EstudiosActualizado = 1; break;
      case 2039851:
        this.EstudiosActualizado = 1; break;
      case 2039852:
        this.EstudiosActualizado = 2; break;
      case 2039853:
        this.EstudiosActualizado = 3; break;
      case 2039854:
        this.EstudiosActualizado = 2; break;
      case 2039855:
        this.EstudiosActualizado = 2; break;
      case 2039856:
        this.EstudiosActualizado = 1; break;
      case 2039857:
        this.EstudiosActualizado = 0; break;
    }
  }

  fileChange(event) {
		let fileList: FileList = event.target.files;
		if (fileList.length > 0) {
      this.archivo = <File>fileList[0];
      console.log(this.archivo);
      if(this.archivo.size > 500000)
      {
        
        this.datosFiscalesForm.patchValue({file:null});
        this.archivo = null;
        this.sharedService.showSnackBar("Archivo supera el maximo de tamaño", null, 3000);
      }else{
        this.informacion = this.archivo.name;
      }
		}
  }

  loadPrevious(){
    let prevId = this.miniPagination.previous;
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    
    if(paginator.selectedIndex-1 < 0){
      paginator.pageIndex -= 1;
      paginator.selectedIndex = paginator.pageSize-1;
    }else{
      paginator.selectedIndex -= 1;
    }

    this.sharedService.setDataToCurrentApp('paginator',paginator);
    this.router.navigate(['/trabajadores/editar/'+prevId]);
  }

  retroceder(number):void{
    this.tab_proceso = number;
    this.indexTab = number - 1;
    
  }

  avanzar(number):void
  {

      this.tab_proceso = number + 1;
      this.indexTab = number;
  }

  verificarRfc(rfc){
    if(rfc.length == 13 && this.trabajador_id == null)
    {
      this.trabajadorService.getValidadorRfc(rfc).subscribe(
        response => {
          if(response == 1)
          {
            this.sharedService.showSnackBar("El trabajador ya existe, por favor, verifique su estatus o ubicación", null, 5000); 
          }
        },
        errorResponse =>{
          this.isLoadingCredential = false;
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000); 
        }
      );

    }
  }

 /*confirmUnlinkTrabajador(){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Liberar Empleado',dialogMessage:'¿Realmente desea liberar el trabajador de su clues? Escriba LIBERAR a continuación para realizar el proceso.',validationString:'LIBERAR',btnColor:'primary',btnText:'Liberar'}
    });

    let id = this.datos_empleado.id;

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.empleadosService.desligarEmpleado(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadEmpleadoData(id);

              let paginator = this.sharedService.getDataFromCurrentApp('paginator');
              if(paginator.selectedIndex > 0){
                paginator.selectedIndex -= 1;
              }else{
                paginator.selectedIndex = paginator.pageSize-1;
              }
              this.sharedService.setDataToCurrentApp('paginator',paginator);
            }
            this.isLoading = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }
    });
  }*/

  ObtenerCatalogos(clave_entidad)
  {
    this.trabajadorService.getCatalogosFiscales(clave_entidad).subscribe(
      response => {
       this.catalogosFiscales = response.data;
      },
      responsError =>{
        //this.sharedService.showSnackBar('Error al intentar descargar el expediente', null, 4000);
      }
    );
  }


  cargarTrabajador(id):void{
    this.isLoadingPage = true;
    this.imagen_trabajador = 'assets/trabajador.jpg';
    let params = {};

    //Inicia: Datos para los botones de Anterior y Siguiente
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    let filter = this.sharedService.getDataFromCurrentApp('filter');
    let query = this.sharedService.getDataFromCurrentApp('searchQuery');

    for (let i in paginator) {
      params[i] = paginator[i];
    }

    for (let i in filter) {
      if(filter.clues){       params['clues']       = filter.clues.clues;    params['active_filter'] = true; }
      if(filter.cr){          params['cr']          = filter.cr.cr;          params['active_filter'] = true; }
      if(filter.estatus){     params['estatus']     = filter.estatus.id;     params['active_filter'] = true; }
      if(filter.rama){        params['rama']        = filter.rama.id;        params['active_filter'] = true; }
      if(filter.grupos){      params['grupos']      = filter.grupos.id;      params['active_filter'] = true; }
      if(filter.adscripcion){ params['adscripcion'] = filter.adscripcion.id; params['active_filter'] = true; }
      if(filter.comisionado){ params['comisionado'] = filter.comisionado;    params['active_filter'] = true; }
      if(filter.e4){          params['e4']          = filter.e4;             params['active_filter'] = true; }
    }
    

    if(query){
      params['query'] = query;
    }
    //Termina: Datos para los botones de Anterior y Siguiente    

    this.trabajadorService.buscarTrabajador(id, params).subscribe(
      response =>{
        if(!response.data){
          this.router.navigate(['/trabajadores']);
        }

        if(response.mini_paginador){
          let paginator = this.sharedService.getDataFromCurrentApp('paginator');

          /*let paginationIndex = response.mini_paginador.next_prev.findIndex(item => item.id == response.data.id);
          //Aqui verificar estatus
          if(paginationIndex < 0){
            this.miniPagination.next = (response.mini_paginador.next_prev[1])?response.mini_paginador.next_prev[1].id:0;
            this.miniPagination.previous = (response.mini_paginador.next_prev[0])?response.mini_paginador.next_prev[0].id:0;
          }else{
            this.miniPagination.next = (response.mini_paginador.next_prev[paginationIndex+1])?response.mini_paginador.next_prev[paginationIndex+1].id:0;
            this.miniPagination.previous = (response.mini_paginador.next_prev[paginationIndex-1])?response.mini_paginador.next_prev[paginationIndex-1].id:0;
          }

          this.miniPagination.total = response.mini_paginador.total;

          this.miniPagination.current = (paginator.pageSize*paginator.pageIndex)+paginator.selectedIndex+1;*/
        }

        this.trabajador = response.data;


        this.Actualizado = (this.trabajador.actualizado == 0)?false:true;
        this.verificarNivel(this.trabajador.nivel_maximo_id);
        if(this.trabajador.actualizado == 1){
          this.actualizado = true;  
        }else if(this.trabajador.actualizado == 0){
          this.actualizado = false;
        }

        if(this.trabajador.rel_datos_comision == null)
        {
          this.puedeDesligar = true;
        }
        //this.actualizado = this.trabajador.actualizado;
        this.datos_personales = response.data;
;
        this.datos_laborales_nomina = this.trabajador.datoslaboralesnomina;
        this.idioma(this.trabajador.idioma_id);
        this.lengua(this.trabajador.lengua_indigena_id);
        
        this.nombre_trabajador= this.trabajador.apellido_paterno+" "+this.trabajador.apellido_materno+" "+this.trabajador.nombre;

        this.trabajadorForm.patchValue(this.trabajador);  //carga datos de trabajador
        this.verificar_curp(this.trabajador.curp);
        if(this.trabajador.idioma_id == null)
        {
            this.trabajadorForm.patchValue({idioma_id: 0});
        }
        this.trabajadorForm.patchValue({municipio: this.trabajador.municipio_nacimiento});
        /* Fech de ingreso */ // Carga datos laborales
        let ingreso;
        this.datosLaborelesForm.patchValue(this.trabajador.datoslaborales);
        
        this.datos_laborales = this.trabajador.datoslaborales;
        if(this.datos_laborales != null)
        {
          if(this.datos_laborales.fecha_ingreso){
            let anio = this.datos_laborales.fecha_ingreso.substring(0,4);
            let mes = (parseInt(this.datos_laborales.fecha_ingreso.substring(5,7)) - 1);
            let dia = parseInt(this.datos_laborales.fecha_ingreso.substring(8,10));
            ingreso = new Date(anio,+mes,dia);
          }
          
          let ingreso_federal;
          if(this.datos_laborales.fecha_ingreso_federal){
            let anio_federal = this.datos_laborales.fecha_ingreso_federal.substring(0,4);
            let mes_federal = (parseInt(this.datos_laborales.fecha_ingreso_federal.substring(5,7)) - 1);
            let dia_federal = parseInt(this.datos_laborales.fecha_ingreso_federal.substring(8,10));
            
            ingreso_federal = new Date(anio_federal,mes_federal,dia_federal);
          }
          
          if(this.datos_laborales.vigencia_fiel != null)
          {
            this.fiel(this.datos_laborales.tiene_fiel);
            let vigencia_fiel;
            let anio_fiel = this.datos_laborales.vigencia_fiel.substring(0,4);
            let mes_fiel = (parseInt(this.datos_laborales.vigencia_fiel.substring(5,7)) - 1)
            let dia_fiel = parseInt(this.datos_laborales.vigencia_fiel.substring(8,10));
            vigencia_fiel = new Date(anio_fiel,+mes_fiel,dia_fiel);
            this.datosLaborelesForm.patchValue({vigencia_fiel: vigencia_fiel}); 
          }
          
          this.datosLaborelesForm.patchValue({fecha_ingreso: ingreso, fecha_ingreso_federal: ingreso_federal}); 
          //Caga datos dehorario
         
        }
        this.datosFiscales = this.trabajador.rel_datos_fiscales;
        
        if(this.datosFiscales != null)
        {
          let fecha_actual = this.datosFiscales.fecha_regimen.substr(0,4)+"-"+this.datosFiscales.fecha_regimen.substr(5,2)+"-"+this.datosFiscales.fecha_regimen.substr(8,2)+"T18:51:49.313Z";
          console.log(fecha_actual);
          let fecha = new Date().toISOString();
          console.log(fecha);
        
          if(this.datosFiscales.documento_digital == 1)
          {
            this.datosFiscalesForm.get('file').setValidators([]); // or clearValidators()
            this.datosFiscalesForm.get('file').updateValueAndValidity();
            /*this.datosFiscalesForm.patchValue(
              {
                file: <File>{}
              });*/
          }
          
          this.datosFiscalesForm.patchValue(
            {
              razon_social: this.datosFiscales.razon_social,
              tipo_vialidad: this.datosFiscales.tipo_vialidad,
              nombre_vialidad: this.datosFiscales.nombre_vialidad,
              no_exterior: this.datosFiscales.no_exterior,
              no_interior: this.datosFiscales.no_interior,
              cp: this.datosFiscales.cp,
              colonia: this.datosFiscales.colonia,
              calle1: this.datosFiscales.calle1,
              calle2: this.datosFiscales.calle2,
              localidad: this.datosFiscales.localidad,
              municipio: this.datosFiscales.municipio,
              entidad: this.datosFiscales.entidad,
              correo: this.datosFiscales.correo,
              lada: this.datosFiscales.lada,
              telefono: this.datosFiscales.telefono,
              //lada2: datosFiscales.lada_telefono2,
              //telefono2: datosFiscales.telefono2,
              //estado_domicilio: datosFiscales.estado_domicilio,
              //estado_contribuyente: datosFiscales.estado_contribuyente,
              //actividad_economina: datosFiscales.actividad_economina,
              //fecha_inicio_actividad: datosFiscales.fecha_actividad_economica,
              regimen: this.datosFiscales.regimen,
              fecha_regimen: fecha_actual,
            }
            
          );
        
        }else{
          this.datosFiscalesForm.patchValue(
            {
              //actividad_economina: "Consultorios de medicina general pertenecientes al sector público",
              regimen: "Sueldos y Salarios e Ingresos Asimilados a Salarios",
            });
        }
        
        let datos_horario = this.trabajador.horario;
        
        if(datos_horario != "")
        {
          
          this.datosHorarioForm.patchValue({jornada_id: this.datos_laborales.jornada_id});
          let dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo", "festivo"];
          for(let i = 0; i < datos_horario.length; i++)
          {
            let indice_dia = datos_horario[i].dia;
            this.jornada(indice_dia, false); 
            switch (indice_dia) {
              case 1: this.datosHorarioForm.patchValue({horario_lunes: true, hora_inicio_lunes: datos_horario[i].entrada, hora_fin_lunes: datos_horario[i].salida }); break;
              case 2: this.datosHorarioForm.patchValue({horario_martes: true, hora_inicio_martes: datos_horario[i].entrada, hora_fin_martes: datos_horario[i].salida }); break;
              case 3: this.datosHorarioForm.patchValue({horario_miercoles: true, hora_inicio_miercoles: datos_horario[i].entrada, hora_fin_miercoles: datos_horario[i].salida }); break;
              case 4: this.datosHorarioForm.patchValue({horario_jueves: true, hora_inicio_jueves: datos_horario[i].entrada, hora_fin_jueves: datos_horario[i].salida }); break;
              case 5: this.datosHorarioForm.patchValue({horario_viernes: true, hora_inicio_viernes: datos_horario[i].entrada, hora_fin_viernes: datos_horario[i].salida }); break;
              case 6: this.datosHorarioForm.patchValue({horario_sabado: true, hora_inicio_sabado: datos_horario[i].entrada, hora_fin_sabado: datos_horario[i].salida }); break;
              case 7: this.datosHorarioForm.patchValue({horario_domingo: true, hora_inicio_domingo: datos_horario[i].entrada, hora_fin_domingo: datos_horario[i].salida }); break;
              case 8: this.datosHorarioForm.patchValue({horario_festivo: true, hora_inicio_festivo: datos_horario[i].entrada, hora_fin_festivo: datos_horario[i].salida }); break;
            
              default:
                break;
            }
          }
        }

        //Escolaridad
        this.datosEscolaresForm.patchValue({ nivel_maximo_id: this.trabajador.nivel_maximo_id});
        let datos_escolares = this.trabajador.escolaridad;
        
        for(let i = 0; i < datos_escolares.length; i++)
        {
          if(datos_escolares[i].nombre_estudio)
          {
            datos_escolares[i].otro_estudio = false;
          }else{
            datos_escolares[i].otro_estudio = true;
          }
          
          if(datos_escolares[i].institucion)
          {
            datos_escolares[i].otro_institucion = false;
          }else{
            datos_escolares[i].otro_institucion = true;
          }
        }
        this.datosEstudios = datos_escolares;
        this.dataSourceEstudios.data = datos_escolares;
        if((this.EstudiosActualizado - datos_escolares.length) <= 0)
        {
          this.EstudiosRestantes = 0;  
        }else
        {
          this.EstudiosRestantes = this.EstudiosActualizado - datos_escolares.length;
        }
        /*
        //Capacitacion
        let Capacitacion = trabajador.capacitacion;
        let CapacitacionDetalles = trabajador.capacitacion_detalles;

        this.datosCapacitacionForm.patchValue(Capacitacion);
        this.tiene_capacitacion(Capacitacion.capacitacion_anual);
        if(!Capacitacion.titulo_capacitacion)
        {
          this.activar_otro_titulo(false);
          this.datosCapacitacionForm.patchValue({otro_estudio_capacitacion: true});
        }
        if(!Capacitacion.institucion)
        {
          this.activar_otro_institucion(false);
          this.datosCapacitacionForm.patchValue({otro_institucion_educativa: true});
        }

        this.dataSourceCapacitacion.data = CapacitacionDetalles;
        //
        
        //Escolaridad Cursante
        let datosEscolaridadCursante = trabajador.escolaridadcursante;
        this.datosCursosForm.patchValue(datosEscolaridadCursante);

        this.tiene_colegio(datosEscolaridadCursante.colegiacion);
        this.tiene_certificado(datosEscolaridadCursante.certificacion);*/

        this.isLoadingCredential = true;
        if(this.trabajador.credencial != null) 
        {
          if(this.trabajador.credencial.foto == 1)
          {
            this.imagen_trabajador = "data:image/png;base64,"+this.trabajador.credencial.foto_trabajador
          }else{

          }
        }else{
          this.imagen_trabajador = 'assets/trabajador.jpg';
        }
        this.isLoadingCredential = false;
        /*this.trabajadorService.getDatosCredencial(trabajador.clave_credencial).subscribe(
          response => {
            
            if(response.length > 0){
              let datosCredencial = response[0];
              if(datosCredencial.tieneFoto == '1'){
                this.imagen_trabajador = 'http://credencializacion.saludchiapas.gob.mx/images/credenciales/'+datosCredencial.id+'.'+datosCredencial.tipoFoto;
              }else{
                this.imagen_trabajador = 'assets/trabajador.jpg';
              }
            }/*else{
              this.datosCredencial = undefined;
            }
            
            this.isLoadingCredential = false;
          },
          errorResponse =>{
            this.isLoadingCredential = false;
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000); 
          }
        );*/
        this.isLoadingPage = false;
      },
      errorResponse =>{
        this.isLoadingPage = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );
  }

  verConstancia()
  {
    this.descargarConstancia =true;
    this.trabajadorService.getConstancia(this.trabajador.id).subscribe(
      response => {
        //saveAs(response, "download.pdf");
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.descargarConstancia = false;
      },
      responsError =>{
        this.descargarConstancia = false;
        this.sharedService.showSnackBar('Error al intentar descargar el expediente', null, 4000);
      }
    );
  }

  cargarBuscadores(edit:boolean = true):void
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
    
      /*this.datosCapacitacionForm.get('titulo_capacitacion').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.capacitacionIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.capacitacionIsLoading = false; 
              let grado = this.datosCapacitacionForm.get('grado_academico_id').value;
              let descripcion = this.datosCapacitacionForm.get('titulo_capacitacion').value;
              if( grado != '' && descripcion!="")
              {
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
      
      this.datosCapacitacionForm.get('institucion').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.institucionIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.institucionIsLoading = false; 
              let descripcion = this.datosCapacitacionForm.get('institucion').value;
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

      this.datosCursosForm.get('carrera_ciclo').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.carreraIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.carreraIsLoading = false; 
              let descripcion = this.datosCursosForm.get('carrera_ciclo').value;
              if(descripcion!="")
              {

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

      this.datosCursosForm.get('institucion_ciclo').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.institucionCicloIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.institucionCicloIsLoading = false; 
              let descripcion = this.datosCursosForm.get('institucion_ciclo').value;
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
      
      this.datosCursosForm.get('colegio').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.colegioIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.colegioIsLoading = false; 
              let descripcion = this.datosCursosForm.get('colegio').value;
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
    if(edit == true)
    {
      this.trabajadorForm.get('cr').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          this.crIsLoading = true;
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              return this.trabajadorService.buscarCr({query:value}).pipe(
                finalize(() => this.crIsLoading = false )
              );
            }else{
              this.crIsLoading = false;
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredCr = items);
    }
      
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
        this.trabajadorForm.patchValue({sexo: 2029389});
      }else if(sexo == "M")
      {
          this.trabajadorForm.patchValue({sexo: 2029390});
      }
      
      if(estado == "NE")
      {
        this.trabajadorForm.get('municipio').disable();
        this.trabajadorForm.get('entidad_nacimiento_id').disable();
        this.trabajadorForm.patchValue({nacionalidad_id: 2047952, entidad_nacimiento_id:2499 });
        
      }else if(estado == "CS"){
        this.trabajadorForm.get('municipio').enable();
        this.trabajadorForm.get('entidad_nacimiento_id').enable();
        this.trabajadorForm.patchValue({nacionalidad_id: 2047951, pais_nacimiento_id:142, entidad_nacimiento_id:7});

      }else{
        this.trabajadorForm.get('municipio').enable();
        this.trabajadorForm.get('entidad_nacimiento_id').enable();
        this.trabajadorForm.patchValue({nacionalidad_id: 2047951});
      }
    }
  }

  accionGuardar(tipo:number):void{
    let data;
    let countError = 0;
    let datos_sep:any;
    let flag_file = true;
    if(tipo == 1)
    {
      data = this.trabajadorForm.value;
      if(data.pais_nacimiento_id == 142)
      {
        if(typeof data.municipio != 'object')
        {
          this.sharedService.showSnackBar("Debe seleccionar un municipio de la lista", "ERROR", 3000);
          countError++;
          this.trabajadorForm.patchValue({municipio:""});
        }else{
          data.municipio_nacimiento_id = data.municipio.id;
        }
        if(data.entidad_nacimiento_id == null)
        {
          this.sharedService.showSnackBar("Debe seleccionar una entidad de la lista", "ERROR", 3000);
          countError++;
        }
        
      }else{
        data.municipio_nacimiento_id = null;
        data.entidad_nacimiento_id = null;
      }
      
      
    }else if(tipo == 2)
    {
      data = this.datosLaborelesForm.value;
     
    }else if(tipo == 3)
    {
      data = this.datosFiscalesForm.value;
      if (this.archivo) {
        this.archivoSubido = false;
        this.isLoading = true;
        let data = {'trabajador_id': this.trabajador_id };
        this.importarService.uploadCsf(data, this.archivo, '').subscribe(
          response => {
            this.isLoading = false;
            //console.log(response);
            if(response.data == 0){
              flag_file = false;
            }
          }, errorResponse => {
            this.sharedService.showSnackBar(errorResponse.error.error, null, 3000);
            this.isLoading = false;
            
          });
      }
      
    }else if(tipo == 4)
    {
      data = this.datosHorarioForm.value;
    }else if(tipo == 5)
    {
      data = this.datosEscolaresForm.value;
      data.datos = this.datosEstudios;
      /*this.trabajadorService.verificacionCedula(this.trabajador).subscribe(
        response =>{
          datos_sep = response;
        },
        errorResponse =>{
          this.isLoading = false;
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.error){
            errorMessage = errorResponse.error.message;
          }
        }
      );*/
      //
    }/*else if(tipo == 5)
    {
      data = this.datosCapacitacionForm.value;
      data.datos = this.datosCapacitacion;
    }else if(tipo == 6)
    {
      data = this.datosCursosForm.value;
      //data.datos = this.datosEstudios;
    }*/
    //datos_sep = {'items':[{'id':"nombre", 'descripcion':'apellido'}]};
    this.isLoading = true;
    data.tipo_dato = tipo;
    data.sep = datos_sep;
    
    if(!flag_file)
    {
      this.sharedService.showSnackBar("Ocurrio un error al subir tu archivo, favor de volver a intentarlo", null, 3000);
    }else{
      if(this.trabajador_id != null && countError == 0)
      {
        this.trabajadorService.guardarTrabajador(this.trabajador_id, data, datos_sep).subscribe(
          response =>{
            this.sharedService.showSnackBar("Se ha Guardado Correctamente", null, 3000);
            this.isLoading = false;
            if(tipo != 6)
            {
              this.tab_proceso = tipo + 1;
              this.indexTab = tipo;
            }else{
              this.finalizarActualizacion = false;
            }
          },
          errorResponse =>{
            this.isLoading = false;
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.error){
              errorMessage = errorResponse.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
            
          }
        );
      }else
      {
        if(this.trabajador_id == null && data.cr == null)
        {
          this.sharedService.showSnackBar("DEBE DE SELECCIONAR UN CENTRO DE RESPONSABILIDAD", "ERROR", 3000);
          countError++;
        }
        
        if(countError == 0)
        {

          this.trabajadorService.guardarNuevoTrabajador( data).subscribe(
            response =>{
              this.sharedService.showSnackBar("Se ha Guardado Correctamente", null, 3000);
              this.isLoading = false;
              this.router.navigate(['/trabajadores/editar/'+response.id+"/1"]);
            },
            errorResponse =>{
              this.isLoading = false;
              var errorMessage = "Ocurrió un error.";
              if(errorResponse.error){
                errorMessage = errorResponse.error.message;
              }
              this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
              
            }
          );
        }
        this.isLoading = false;
      }
    }
    
  }

  accionFinalizar()
  {
    this.trabajadorService.guardarFinalizarTrabajador(this.trabajador_id).subscribe(
      response =>{
        this.sharedService.showSnackBar("Se ha Guardado Correctamente", null, 3000);
        this.router.navigate(['/trabajadores']);
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
        data:{scSize:this.mediaSize, catalogos: this.catalogo['grado_academico_estudios'], editable: this.datosEstudios[index_editable] },
      };
    }else{
      
      configDialog = {
        width: '95%',
        data:{ catalogos: this.catalogo['grado_academico_estudios'], editable: this.datosEstudios[index_editable] },
      }
    }
    const dialogRef = this.dialog.open(EstudiosDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        if(valid.estatus){
         
          if(index != null)
          {
            this.datosEstudios[index] = valid.datos;  
          }else{
            if(this.datosEstudios.length == 4)
            {
              let mensaje = "Solo se puede agregar hasta 4 grados escolares";
              this.sharedService.showSnackBar(mensaje, "ERROR", 3000);
            }else{
              this.datosEstudios.push(valid.datos);
            }
            
          }
          this.dataSourceEstudios.data = this.datosEstudios;
          
        }
      }
    });
  }
  
  /*showCapacitacionDialog(index_editable = null){
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
         
          this.dataSourceCapacitacion.data = this.datosCapacitacion;
        }
      }
    });
  }*/

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

  idioma(valor):void{
    if(valor == '0' || valor == null)
    {
      this.trabajadorForm.get('nivel_idioma_id').disable();
    }else if(valor != '0')
    {
      this.trabajadorForm.get('nivel_idioma_id').enable();
    }
  }

  lengua(valor):void{
    if(valor == '102')
    {
      this.trabajadorForm.get('nivel_lengua_id').disable();
    }else if(valor != '102')
    {
      this.trabajadorForm.get('nivel_lengua_id').enable();
    }
  }
  
  activar_otro_titulo(valor)
  {
    /*if(valor){
      this.datosCapacitacionForm.get('titulo_capacitacion').enable();
      this.datosCapacitacionForm.get('otro_nombre_titulo').disable();
    }else{
      this.datosCapacitacionForm.get('titulo_capacitacion').disable();
      this.datosCapacitacionForm.get('otro_nombre_titulo').enable();
    } */ 
    
  }

  activar_otro_institucion(valor)
  {
    /*if(valor){
      this.datosCapacitacionForm.get('institucion').enable();
      this.datosCapacitacionForm.get('otro_nombre_institucion').disable();
    }else{
      this.datosCapacitacionForm.get('institucion').disable();
      this.datosCapacitacionForm.get('otro_nombre_institucion').enable();
    } */  
  }

  /*tiene_capacitacion(valor):void{
    if(valor == '0')
    {
      this.datosCapacitacionForm.get('grado_academico_id').disable();
      this.datosCapacitacionForm.get('titulo_capacitacion').disable();
      this.datosCapacitacionForm.get('otro_nombre_titulo').disable();
      this.datosCapacitacionForm.get('institucion').disable();
      this.datosCapacitacionForm.get('otro_nombre_institucion').disable();
      this.datosCapacitacionForm.get('ciclo_id').disable();
      this.datosCapacitacionForm.get('otro_estudio_capacitacion').disable();
      this.datosCapacitacionForm.get('otro_institucion_educativa').disable();
    }else if(valor == '1')
    {
      this.datosCapacitacionForm.get('grado_academico_id').enable();
      this.datosCapacitacionForm.get('ciclo_id').enable();
      this.datosCapacitacionForm.get('otro_estudio_capacitacion').enable();
      this.datosCapacitacionForm.get('otro_institucion_educativa').enable();

      this.activar_otro_institucion(!this.datosCapacitacionForm.get('otro_institucion_educativa').value);
      this.activar_otro_titulo(!this.datosCapacitacionForm.get('otro_estudio_capacitacion').value);
    }
  }

  tiene_colegio(valor):void{
    if(valor == '0')
    {
      this.datosCursosForm.get('colegio').disable();
    }else if(valor == '1')
    {
      this.datosCursosForm.get('colegio').enable();
    }
  }

  tiene_certificado(valor):void{
    if(valor == '0')
    {
      this.datosCursosForm.get('certificacion_id').disable();
    }else if(valor == '1')
    {
      this.datosCursosForm.get('certificacion_id').enable();
    }
  }*/

  jornada(key, valor, inicio:any = null, fin:any = null)
  {
    
    switch (key) {
      case 1:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_lunes').disable();
          this.datosHorarioForm.get('hora_fin_lunes').disable();
          this.datosHorarioForm.patchValue({hora_inicio_lunes: inicio, hora_fin_lunes: fin} );
          
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_lunes').enable();
          this.datosHorarioForm.get('hora_fin_lunes').enable();
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_lunes: true});
            this.datosHorarioForm.patchValue({hora_inicio_lunes: inicio, hora_fin_lunes: fin} );
          }
        }  
      break;
      case 2:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_martes').disable();
          this.datosHorarioForm.get('hora_fin_martes').disable();
          this.datosHorarioForm.patchValue({hora_inicio_martes: inicio, hora_fin_martes: fin} );
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_martes').enable();
          this.datosHorarioForm.get('hora_fin_martes').enable();
          
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_martes: true});
            this.datosHorarioForm.patchValue({hora_inicio_martes: inicio, hora_fin_martes: fin} );
          }
        }  
      break;
      case 3:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_miercoles').disable();
          this.datosHorarioForm.get('hora_fin_miercoles').disable();
          this.datosHorarioForm.patchValue({hora_inicio_miercoles: inicio, hora_fin_miercoles: fin} );
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_miercoles').enable();
          this.datosHorarioForm.get('hora_fin_miercoles').enable();
          
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_miercoles: true});
            this.datosHorarioForm.patchValue({hora_inicio_miercoles: inicio, hora_fin_miercoles: fin} );
          }
        }  
      break;
      case 4:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_jueves').disable();
          this.datosHorarioForm.get('hora_fin_jueves').disable();
          this.datosHorarioForm.patchValue({hora_inicio_jueves: inicio, hora_fin_jueves: fin} );
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_jueves').enable();
          this.datosHorarioForm.get('hora_fin_jueves').enable();
          
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_jueves: true});
            this.datosHorarioForm.patchValue({hora_inicio_jueves: inicio, hora_fin_jueves: fin} );
          }
        }  
      break;
      case 5:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_viernes').disable();
          this.datosHorarioForm.get('hora_fin_viernes').disable();
          this.datosHorarioForm.patchValue({hora_inicio_viernes: inicio, hora_fin_viernes: fin} );
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_viernes').enable();
          this.datosHorarioForm.get('hora_fin_viernes').enable();
          
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_viernes: true});
            this.datosHorarioForm.patchValue({hora_inicio_viernes: inicio, hora_fin_viernes: fin} );
          }
        }  
      break;
      case 6:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_sabado').disable();
          this.datosHorarioForm.get('hora_fin_sabado').disable();
          this.datosHorarioForm.patchValue({hora_inicio_sabado: inicio, hora_fin_sabado: fin} );
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_sabado').enable();
          this.datosHorarioForm.get('hora_fin_sabado').enable();
          
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_sabado: true});
            this.datosHorarioForm.patchValue({hora_inicio_sabado: inicio, hora_fin_sabado: fin} );
          }
        }  
      break;
      case 7:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_domingo').disable();
          this.datosHorarioForm.get('hora_fin_domingo').disable();
          this.datosHorarioForm.patchValue({hora_inicio_domingo: inicio, hora_fin_domingo: fin} );
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_domingo').enable();
          this.datosHorarioForm.get('hora_fin_domingo').enable();
          
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_domingo: true});
            this.datosHorarioForm.patchValue({hora_inicio_domingo: inicio, hora_fin_domingo: fin} );
          }
        }  
      break;
      case 8:
        if(valor){
          this.datosHorarioForm.get('hora_inicio_festivo').disable();
          this.datosHorarioForm.get('hora_fin_festivo').disable();
          this.datosHorarioForm.patchValue({hora_inicio_festivo: inicio, hora_fin_festivo: fin} );
        }else{
          this.dias++;;
          this.datosHorarioForm.get('hora_inicio_festivo').enable();
          this.datosHorarioForm.get('hora_fin_festivo').enable();
          
          if(inicio != null && fin != null)
          {
            this.datosHorarioForm.patchValue({horario_festivo: true});
            this.datosHorarioForm.patchValue({hora_inicio_festivo: inicio, hora_fin_festivo: fin} );
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
  
  CopiarDatosLaborales()
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Copiar Datos Personales',dialogMessage:'¿Realmente desea copiar sus datos personales a los datos fiscales?',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        let indice_entidad = this.catalogo['entidad'].findIndex(x=>x.id == this.trabajadorForm.get('entidad_nacimiento_id').value);
        //let actividad = this.datosFiscalesForm.get('actividad_economina').value;
        let regimen = this.datosFiscalesForm.get('regimen').value;
        /*if(this.datosFiscalesForm.get('actividad_economina').value == '')
        {
          actividad = "Consultorios de medicina general pertenecientes al sector público";
        }*/
        if(this.datosFiscalesForm.get('regimen').value == '')
        {
          regimen = "Sueldos y Salarios e Ingresos Asimilados a Salarios";
        }
        this.datosFiscalesForm.patchValue(
          {
            razon_social: this.trabajadorForm.get('nombre').value+" "+this.trabajadorForm.get('apellido_paterno').value+" "+this.trabajadorForm.get('apellido_materno').value,
            cp: this.trabajadorForm.get('cp').value,
            nombre_vialidad: this.trabajadorForm.get('calle').value,
            no_exterior: this.trabajadorForm.get('no_exterior').value,
            no_interior: this.trabajadorForm.get('no_interior').value,
            colonia: this.trabajadorForm.get('colonia').value,
            correo: this.trabajadorForm.get('correo_electronico').value,
            //telefono1: this.trabajadorForm.get('telefono_fijo').value,
            telefono: this.trabajadorForm.get('telefono_celular').value,
            entidad: this.catalogo['entidad'][indice_entidad].descripcion,
            municipio: this.trabajadorForm.get('municipio').value.descripcion,
            localidad: this.trabajadorForm.get('municipio').value.descripcion,
            //actividad_economina: actividad,
            regimen: regimen,
          }
        );
      }
    });
  }

  desligarTrabajador()
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Liberar Trabajador',dialogMessage:'¿Realmente desea liberar al trabajador de su clues y cr Física? Escriba LIBERAR a continuación para realizar el proceso.',validationString:'LIBERAR',btnColor:'primary',btnText:'Liberar'}
    });
    
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoading = true;
        this.trabajadorService.desligarEmpleado(this.trabajador_id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.sharedService.showSnackBar("Se ha desligado al trabajador de su Clues y CR Física", 'Cerrar', 4000);
              this.router.navigate(['/trabajadores']);
              //this.cargarTrabajador(this.trabajador_id);
            }
            this.isLoading = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }
    });
  }
  
  /*eliminarCapacitacion(index)
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
  }*/

  /* Displays functions */
  displayCrFn(item: any) {
    if (item) { return item.descripcion; }
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
