import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioService } from '../servicio.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface VerPrestamoData {
  datos: any;
  prestamo?:number;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  nombre_trabajador:string = "";
  boton_devolucion:boolean = false;

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: VerPrestamoData,
    public dialogRef: MatDialogRef<FormularioComponent>,
    private servicioService: ServicioService,
    public mediaObserver: MediaObserver,
  ) { }

  public PrestamoForm = this.fb.group({
    'id':               [],
    'trabajador_id':    [],
    'no_expediente':    ['',Validators.required],
    'no_vale':          ['',Validators.required],
    'fecha_prestamo':   ['',Validators.required],
    'prestamista':      ['',Validators.required],
    'area_prestamista': ['',Validators.required],
    'observacion':      [''],
  });

  ngOnInit(): void {
    ///console.log(this.data);
    let trabajador = this.data.datos;
    this.nombre_trabajador = trabajador.apellido_paterno+" "+trabajador.apellido_materno+" "+trabajador.nombre;
    this.PrestamoForm.patchValue({no_expediente: trabajador.no_expediente});
    if(this.data.prestamo)
    {
      this.cargarInformacion();
    }

  }

  cargarInformacion():void{
    let trabajador = this.data.datos;
    let expediente = this.data.datos.rel_trabajador_expediente;
    this.PrestamoForm.patchValue({no_expediente: trabajador.no_expediente, 
                                  no_vale: expediente.no_vale,
                                  fecha_prestamo: expediente.fecha_prestamo+"T16:00:00",
                                  prestamista: expediente.trabajador_prestamista,
                                  area_prestamista: expediente.area_prestamista,
                                  observacion: expediente.observaciones,
                                  });
    this.boton_devolucion = true;
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  guardar():void{
    if(this.data.prestamo == 1)
    {
      this.PrestamoForm.patchValue({id: this.data.datos.id, trabajador_id: this.data.datos.id});
      this.servicioService.editarPrestamo(this.data.datos.rel_trabajador_expediente.id, this.PrestamoForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          
        },
        errorResponse =>{
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        }
      );
    }else{
      this.PrestamoForm.patchValue({id: this.data.datos.id, trabajador_id: this.data.datos.id});
      this.servicioService.guardarPrestamo(this.PrestamoForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          
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
    
  }
  devolver():void{
    this.servicioService.devolverPrestamo(this.data.datos.rel_trabajador_expediente.id,this.PrestamoForm.value).subscribe(
      response =>{
        this.dialogRef.close(true);
        
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

}
