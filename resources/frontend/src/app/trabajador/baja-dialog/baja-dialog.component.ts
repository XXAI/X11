import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadorService } from '../trabajador.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@Component({
  selector: 'app-baja-dialog',
  templateUrl: './baja-dialog.component.html',
  styleUrls: ['./baja-dialog.component.css']
})
export class BajaDialogComponent implements OnInit {

  tipo_baja:any = [{id:1, descripcion: "Baja Temporal"},{id:2, descripcion: "Baja Permanente"}];
  resultado:any = { estatus: false, datos:{}};
  catalogo_baja:any = [];

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BajaDialogComponent>,
    private trabajadorService: TrabajadorService,
    public mediaObserver: MediaObserver,
  ) { }

  public BajaForm = this.fb.group({
    'tipo_baja_id': ['',Validators.required],
    'baja_id':               [{ value:'', disabled:false}, Validators.required],
    'fecha_baja':     [{ value:'', disabled:false}, Validators.required],
    'observacion':     [{ value:'', disabled:false}, Validators.required],
  });

  ngOnInit() {
    this.cargarBuscadores();
  }

  cargarBuscadores():void{
    this.trabajadorService.buscar({tipo:11, query:''}).subscribe(
      response =>{
        
        this.catalogo_baja = response;
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

  cancelar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Dar de Baja',dialogMessage:'¿Realmente desea dar de baja al empleado? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Guardar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        //this.accionGuardar(true);
        this.BajaTrabajador();
          
      }
    });
  }

  BajaTrabajador():void{
    this.trabajadorService.bajaTrabajador(1, this.BajaForm.value).subscribe(
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
