import { Component, OnInit, Inject } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ComisionService } from '../comision.service';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface RegistroData {
  id: number;
  trabajador_id?:number;
  folio?:string;
  clues?:any;
  clues_adscripcion?:any;
  fecha_oficio?:string;
  fecha_inicio?:string;
  fecha_fin?:string;
  catalogo_cr:any;
  trabajador:any;
  reingenieria:any;
  fecha_recepcion:any;
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
  validaFechaRecepcion: boolean = false;

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
    public comisionService:ComisionService
    ) { }

  public formularioForm = this.fb.group({
   
    'folio': [''],
    'trabajador': [''],
    'clues': ['',[Validators.required]],
    'fecha_oficio': ['',[Validators.required]],
    'fecha_inicio_periodo': [''],
    'fecha_fin_periodo': [''],
    'trabajador_id': ['',[Validators.required]],
    'reingenieria': ['',[Validators.required]],
    'fecha_recepcion': ['',[Validators.required]],
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

  public verificar(fecha_recepcion)
  {
    if(fecha_recepcion == 0)
    {
      this.validaFechaRecepcion = false;
    }else{
      this.validaFechaRecepcion = true;
    }
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
          folio:this.data.folio, 
          clues:this.data.clues, 
          fecha_oficio:this.data.fecha_oficio+"T18:51:49.313Z", 
          fecha_inicio_periodo:this.data.fecha_inicio+"T18:51:49.313Z",
          fecha_fin_periodo:this.data.fecha_fin+"T18:51:49.313Z",
          trabajador_id: this.data.trabajador.id,
          reingenieria: this.data.reingenieria,
          fecha_recepcion: this.data.fecha_recepcion
        });

        this.verificar(this.data.fecha_recepcion);
        
        this.clues_nominal = this.data.clues_adscripcion.clues+" "+this.data.clues_adscripcion.descripcion_actualizada;
        this.cr_nominal = this.data.clues_adscripcion.cr+" "+this.data.clues_adscripcion.descripcion_actualizada
      }else{
        this.formularioForm.patchValue({
          fecha_recepcion:0
        });
      }
  }

  public buscarTrabajador()
  {
    this.arreglo_trabajador = [];
    this.buscador = true;
    this.comisionService.getTrabajador({busqueda_empleado: this.formularioForm.controls['trabajador'].value}).subscribe(
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

    let numero_folio = parseInt(this.formularioForm.controls['folio'].value);
    
    if(numero_folio%2==0)
    {
      const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
        width: '500px',
        data:{dialogTitle:'VALIDACIÓN',dialogMessage:'¿Esta registrando un número par, esta seguro/a de usar este numero de folio?',btnColor:'primary',btnText:'Aceptar'}
      });
  
      dialogRef.afterClosed().subscribe(valid => {
        if(valid){
          this.guardarInformacion();
        }else{
          this.isLoading = false;
        }
      });
    }else
    {
      this.guardarInformacion();
    }
  }

  guardarInformacion(){
    if(this.data.id)
    {
      this.comisionService.editarComision(this.data.id,this.formularioForm.value).subscribe(
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
      let trabajador = this.formularioForm.controls['trabajador_id'].value; 
      this.comisionService.verificarRegistroComision(trabajador).subscribe(
        response => {
          if(parseInt(response.data)>0)
          {
            this.guardarFormulario();
          }else{
            this.confirmacionGuardar();
          }
        },
        errorResponse =>{
          console.log(errorResponse);
          
          this.isLoading = false;
          var errorMessage = "Ocurrió un error.";
          this.sharedService.showSnackBar(errorResponse.error.message, null, 3000);
        }
      );

      /**/
      
    }
  }

  confirmacionGuardar()
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'VERIFICACIÓN',dialogMessage:'¿No tiene comisión registrada en el sistema, desea registrar la comision?',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.guardarFormulario();
      }else{
        this.isLoading = false;
      }
    });
  }

  guardarFormulario()
  {
    this.comisionService.guardarComision(this.formularioForm.value).subscribe(
      response => {
        this.formularioForm.patchValue({trabajador:'',trabajador_id:'',clues:'', fecha_oficio:'', fecha_cambio:''});
        this.clues_nominal = "";
        this.cr_nominal = "";
        this.isLoading = false;
        this.sharedService.showSnackBar("SE GUARDO CORRECTAMENTE", null, 3000);
      },
      errorResponse =>{
        console.log(errorResponse);
        
        this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        this.sharedService.showSnackBar(errorResponse.error.message, null, 3000);
      }
    );
  }

  cerrar()
  {
    this.dialogRef.close();
  }

}
