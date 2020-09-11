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

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  constructor(
    private sharedService: SharedService, 
    private trabajadorService: TrabajadorService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }
  
  trabajadorForm = this.fb.group({
   
    'nombre': ['',[Validators.required]],
    'apellido_paterno': [''],
    'apellido_materno': [''],
    'rfc': ['',[Validators.required]],
    'curp': ['',[Validators.required]],
    'pais_nacimiento_id': ['',[Validators.required]],
    'entidad_nacimiento_id': ['',[Validators.required]],
    'municipio_nacimiento_id': ['',[Validators.required]],
    'nacionalidad_id': ['',[Validators.required]],
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

    //Cursos
    'tipo_ciclo_formacion_id':[],
    'carrera_ciclo_id':[],
    'institucion_ciclo_id':[],
    'anio_cursa_id':[],
    'colegiacion':[],
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
    'titulo_diploma_id':[],
    'otro_nombre_titulo':[],
    'institucion_id':[],
    'otro_nombre_institucion':[],
    'ciclo_id':[],


  });

  displayedColumns: string[] = ['tipo','descripcion','institucion','cedula','actions'];
  displayedColumnsCursos: string[] = ['entidad','nombre_curso','actions'];
  dataSource: any = [];
  dataSourceCapacitacion: any = [];
  

  ngOnInit() {
    this.trabajadorForm.patchValue({fecha_nacimiento: new Date('1987/01/28')}); 
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

      }else if(sexo == "F")
      {

      }
      if(estado == "NE")
      {

      }else{

      }
    }
  }

}
