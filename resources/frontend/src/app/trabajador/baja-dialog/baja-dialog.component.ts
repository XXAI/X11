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

export interface VerEmpleadoData {
  id: number;
  nombre_completo?:string;
}

@Component({
  selector: 'app-baja-dialog',
  templateUrl: './baja-dialog.component.html',
  styleUrls: ['./baja-dialog.component.css']
})
export class BajaDialogComponent implements OnInit {

  tipo_baja:any = [{id:1, descripcion: "Baja Temporal"},{id:2, descripcion: "Baja Permanente"}];
  resultado:any = { estatus: false, datos:{}};
  catalogo_baja:any = [];
  catalogo_baja_temporal:any = [];
  catalogo_baja_definitiva:any = [];
  nombre_trabajador:string;

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: VerEmpleadoData,
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
    console.log(this.data);
    this.nombre_trabajador = this.data.nombre_completo;
  }

  cargarBuscadores():void{
    this.trabajadorService.buscar({tipo:11, query:''}).subscribe(
      response =>{
        
        //this.catalogo_baja = response;
        response.forEach(element => {
          console.log(element.tipo_baja);
          if(element.tipo_baja == 1)
          {
            this.catalogo_baja_temporal.push(element);
          }if(element.tipo_baja == 2)
          {
            this.catalogo_baja_definitiva.push(element);
          }
        });
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

  seleccionarBaja(index)
  {
    
    if(index == 1)
    {
      this.catalogo_baja = this.catalogo_baja_temporal;
    }else{
      this.catalogo_baja = this.catalogo_baja_definitiva;
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Dar de Baja',dialogMessage:'¿Realmente desea dar de baja al trabajador? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Guardar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        //this.accionGuardar(true);
        this.BajaTrabajador();
          
      }
    });
  }

  BajaTrabajador():void{
    this.trabajadorService.bajaTrabajador(this.data.id, this.BajaForm.value).subscribe(
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
