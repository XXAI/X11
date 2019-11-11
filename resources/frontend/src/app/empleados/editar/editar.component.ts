import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { EmpleadosService } from '../empleados.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map, throwIfEmpty } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { EstudiosDialogComponent } from '../estudios-dialog/estudios-dialog.component';
import { TransferenciaEmpleadoDialogComponent } from '../transferencia-empleado-dialog/transferencia-empleado-dialog.component';
import { EditarHorarioDialogComponent } from '../editar-horario-dialog/editar-horario-dialog.component';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


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

  puedeGuardar: boolean = true;
  puedeTransferir: boolean = true;
  statusLabel: string;
  statusIcon: string;

  displayedColumns: string[] = ['Grado','Estudios','Fecha','actions'];
  tablaEscolaridad: any = [{id:1,grado:'123',estudios:'12312',fecha:'123'}];

                        //de = dia entrada, he = hora entrada, ds = dia salida, hs = hora salida
  horarioEmpleado: any = [
      {id:1,de:'1',he:'20:00',ds:'2',hs:'03:00'},
      {id:2,de:'2',he:'20:00',ds:'3',hs:'03:00'},
      {id:3,de:'3',he:'20:00',ds:'4',hs:'03:00'},
      {id:4,de:'4',he:'20:00',ds:'5',hs:'03:00'},
      {id:5,de:'5',he:'20:00',ds:'6',hs:'03:00'},
      {id:6,de:'6',he:'20:00',ds:'7',hs:'03:00'},
      {id:7,de:'7',he:'20:00',ds:'1',hs:'03:00'}
  ];
  //tablaHorario: any = {1:[],2:[],3:[],4:[],5:[],6:[],7:[]};
  tablaHorarioDias: any = [{label:'Lu',count:0},{label:'Ma',count:0},{label:'Mi',count:0},{label:'Ju',count:0},{label:'Vi',count:0},{label:'Sa',count:0},{label:'Do',count:0}];
  tablaHorarioHoras: any = [];

  datosCredencial:any;

  photoPlaceholder = 'assets/profile-icon.svg';

  constructor(
    private sharedService: SharedService, 
    private empleadosService: EmpleadosService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  isLoading:boolean = false;
  isLoadingCredential:boolean = false;
  hidePassword:boolean = true;

  empleadoForm = this.fb.group({
    'rfc': ['',Validators.required],
    'curp': ['',[Validators.required]],
    'nombre': ['',[Validators.required]],
    'fissa': ['',[Validators.required]],
    'figf': [false],
    'clues': [''],
    'clues_desc': [''],
    'horario':[''],
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
      //this.loadCatalogos();

      this.id_empleado = params.get('id');
      this.loadEmpleadoData(this.id_empleado);

      //console.log(this.horarioEmpleado);
      this.horarioEmpleado.forEach(element => {
        //this.tablaHorario[element.de].push({id:element.id, start:element.he});
        //this.tablaHorario[element.ds].push({id:element.id, end:element.hs});

        this.tablaHorarioDias[element.de-1].count++;
        this.tablaHorarioDias[element.ds-1].count++;
        
        this.tablaHorarioHoras.push({dia:element.de,hora:element.he,tipo:'start'});
        this.tablaHorarioHoras.push({dia:element.ds,hora:element.hs,tipo:'end'});
      });

      this.tablaHorarioHoras.sort((a,b)=>(a.dia > b.dia)?1:((a.dia == b.dia)?((a.hora > b.hora)?1:-1):-1));

      //console.log(this.tablaHorarioDias);
      //console.log(this.tablaHorarioHoras);
    });
  }

  loadEmpleadoData(id:any)
  {
    this.isLoading = true;
    this.isLoadingCredential = true;
    let params = {};

    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    let filter = this.sharedService.getDataFromCurrentApp('filter');

    for (let i in paginator) {
      params[i] = paginator[i];
    }

    for (let i in filter) {
      if(filter[i]){
        params[i] = filter[i];
      }
    }

    //params.paginator = JSON.stringify(this.sharedService.getDataFromCurrentApp('paginator'));
    //params.filter = JSON.stringify(this.sharedService.getDataFromCurrentApp('filter'));

    this.empleadosService.obtenerDatosEmpleado(id,params).subscribe(
      response =>{
        console.log(response);
        if(typeof response === 'object'){
          this.datos_empleado = response.data;

          this.puedeTransferir = true;
          this.puedeGuardar = true;
          this.statusIcon = 'help';
          this.statusLabel = 'Por Validar';

          if(this.datos_empleado.permuta_adscripcion_activa){
            this.puedeTransferir = false;
            this.puedeGuardar = false;
            this.statusLabel = 'En Transferencia';
            this.statusIcon = 'notification_important';
          }

          this.empleado = true;

          this.loadCatalogos(this.datos_empleado);

          if(this.datos_empleado.clave_credencial){
            this.empleadosService.getDatosCredencial(this.datos_empleado.clave_credencial).subscribe(
              response => {
                console.log(response);
                if(response.length > 0){
                  this.datosCredencial = response[0];
                  if(this.datosCredencial.tieneFoto == '1'){
                    this.datosCredencial.photo = 'http://credencializacion.saludchiapas.gob.mx/images/credenciales/'+this.datosCredencial.id+'.'+this.datosCredencial.tipoFoto;
                  }else{
                    this.datosCredencial.photo = this.photoPlaceholder;
                  }
                }else{
                  this.datosCredencial = undefined;
                }
                this.isLoadingCredential = false;
              }
            );
          }
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

  loadCatalogos(obj_empleado:any){
    this.empleadosService.getCatalogosList(obj_empleado).subscribe(
      response =>{
        //console.log(response);
        this.catalogos = response;
        this.empleadoForm.patchValue(this.datos_empleado);
        this.empleadoForm.patchValue({ "clues": this.datos_empleado.clues.clues });
        this.empleadoForm.patchValue({ "clues_desc": this.datos_empleado.clues.nombre_unidad});
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

  showEstudiosDialog(id?:number){
    const dialogRef = this.dialog.open(EstudiosDialogComponent, {
      width: '80%',
      data: {id:id}
    });

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        console.log(response);
      }
    });
  }

  showHorarioDialog(){
    const dialogRef = this.dialog.open(EditarHorarioDialogComponent, {
      width: '80%',
      data: {id:this.datos_empleado.id, horarioActual:this.horarioEmpleado}
    });

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        console.log(response);
      }
    });
  }

  showTransferenciaEmpleadoDialog(id:number){
    const dialogRef = this.dialog.open(TransferenciaEmpleadoDialogComponent, {
      width: '90%',
      data: {id:id, cluesActual:this.datos_empleado.clues.clues}
    });

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        this.loadEmpleadoData(id);

        /*this.statusLabel = 'En Transferencia';
        this.statusIcon = 'help';
        this.puedeTransferir = false,
        this.puedeGuardar = false;*/
        console.log(response);
      }
    });
  }

  confirmUntieEmploye(){
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
              console.log(response);
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
  }

  confirmBorrarEstudio(id: number){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Borrar Elemento',dialogMessage:'¿Realmente desea borrar el estudo seleccionado?',btnColor:'warn',btnText:'Borrar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('borrado:' + id);
      }else{
        console.log('cancelado');
      }
    });
  }

  confirmGuardarValidar(){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Guardar y Validar',dialogMessage:'¿Realmente desea validar los datos guardados? Escriba VALIDAR a continuación para realizar el proceso.',validationString:'VALIDAR',btnColor:'primary',btnText:'Guardar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log(valid);
      }
    });
  }

  accionGuardar(){
    console.log(this.empleadoForm.value);
  }
}
