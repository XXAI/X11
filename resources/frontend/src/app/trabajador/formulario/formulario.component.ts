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
    'pais_nacimiento': ['',[Validators.required]],
    'entidad_nacimiento': ['',[Validators.required]],
    'municipio_nacimiento': ['',[Validators.required]],
    'nacionalidad': ['',[Validators.required]],
    'fecha_nacimiento': ['',[Validators.required]],
    'edad': ['',[Validators.required]],
    'estado_conyugal': ['',[Validators.required]],
    'sexo': ['',[Validators.required]],
    'telefono_fijo': ['',[Validators.required]],
    'telefono_celular': ['',[Validators.required]],
    'correo_electronico': ['',[Validators.required]],
    'calle': ['',[Validators.required]],
    'no_interior': ['',[Validators.required]],
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

  });

  

  ngOnInit() {
    
  }

}
