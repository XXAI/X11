import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { EmpleadosService } from '../empleados.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  catalogos:any[] = [];
  id_empleado:any;
  empleado:boolean = false;
  datos_empleado:any;

  constructor(
    private sharedService: SharedService, 
    private empleadosService: EmpleadosService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  isLoading:boolean = false;
  hidePassword:boolean = true;

  empleadoForm = this.fb.group({
    'rfc': ['',Validators.required],
    'curp': ['',[Validators.required]],
    'nombre': ['',[Validators.required]],
    'fissa': ['',[Validators.required]],
    'figf': [false],
    'clues': [''],
    'tipo_nomina_id': [[]],
    'programa_id': [[]],
    'fuente_id': [[]],
    'codigo_id': [[]],
    'cr_id': [[]],
    'rama_id': [[]],
    'tipo_profesion_id': [[]],
    'profesion_id': [[]],
    'crespdes': [[]],
    'comision_sindical': [[]]
  });

  

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      //console.log(params.get('id'));
      //this.loadEmpleadoData(params.get('id'));
      this.id_empleado = params.get('id');
      //this.loadCatalogos();
      this.loadEmpleadoData(this.id_empleado);
    });
  }

  loadEmpleadoData(id:any)
  {
    this.isLoading = true;
    this.empleadosService.desligarEmpleado(id).subscribe(
      response =>{
        this.datos_empleado = response;
        //this.empleadoForm.patchValue(response);
        //this.empleadoForm.patchValue({ "clues": response.clues.clues +" "+response.clues.nombre_unidad });
        if(typeof response === 'object')
        {
          this.empleado = true;
          this.loadCatalogos(this.datos_empleado)
        }
          /*if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.dataSource = [];
          this.resultsLength = 0;
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          }
        }*/
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

  loadCatalogos(obj_empleado:any)
  {
    this.empleadosService.getCatalogosList(obj_empleado).subscribe(
      response =>{
        //console.log(response);
        this.catalogos = response;
        this.empleadoForm.patchValue(this.datos_empleado);
        this.empleadoForm.patchValue({ "clues": this.datos_empleado.clues.clues +" "+this.datos_empleado.clues.nombre_unidad });
        this.empleadoForm.patchValue({ "tipo_profesion_id": this.catalogos['consulta_tipo_profesion'] });
        
        //this.loadEmpleadoData(this.id_empleado);
        /*if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.dataSource = [];
          this.resultsLength = 0;
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          }
        }*/
        this.isLoading = false;
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }
}
