import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioService } from '../../servicio.service';
import { MediaObserver } from '@angular/flex-layout';

export interface Datos {
  registro: number;
}

@Component({
  selector: 'app-registro-general',
  templateUrl: './registro-general.component.html',
  styleUrls: ['./registro-general.component.css']
})
export class RegistroGeneralComponent implements OnInit {

  anios:any[] = [ {id: 2024 }, {id: 2025 }]
  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegistroGeneralComponent>,
    private servicioService: ServicioService,
    public mediaObserver: MediaObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public RegistroForm = this.fb.group({
    'descripcion':['',Validators.required],
    //'anio':['',Validators.required],
    'brigadista_generalizar':[''],
    'vacunacion_generalizar':[''],
    'dengue_generalizar':[''],

    'brigadista_1':[''],
    'vacunacion_1':[''],
    'dengue_1':[''],
    
    'brigadista_2':[''],
    'vacunacion_2':[''],
    'dengue_2':[''],
    
    'brigadista_3':[''],
    'vacunacion_3':[''],
    'dengue_3':[''],
    
    'brigadista_4':[''],
    'vacunacion_4':[''],
    'dengue_4':[''],

    'brigadista_5':[''],
    'vacunacion_5':[''],
    'dengue_5':[''],
    
    'brigadista_6':[''],
    'vacunacion_6':[''],
    'dengue_6':[''],
    
    'brigadista_7':[''],
    'vacunacion_7':[''],
    'dengue_7':[''],
    
    'brigadista_8':[''],
    'vacunacion_8':[''],
    'dengue_8':[''],

    'brigadista_9':[''],
    'vacunacion_9':[''],
    'dengue_9':[''],
    
    'brigadista_10':[''],
    'vacunacion_10':[''],
    'dengue_10':[''],
    
    'brigadista_11':[''],
    'vacunacion_11':[''],
    'dengue_11':[''],
    
    'brigadista_12':[''],
    'vacunacion_12':[''],
    'dengue_12':[''],
    
  });

  ngOnInit(): void {
    this.cargarDefault();
    if(this.data.id != null)
    {
      this.cargarDatos();
    }
  }

  cargarDatos()
  {
    this.servicioService.verBrigadista(this.data.id, null).subscribe(
      response =>{
        ///this.sharedService.showSnackBar("SE HA GUARDADO CORRECTAMENTE", null, 3000);
        let datos = response.data;
        this.RegistroForm.patchValue({descripcion: datos.descripcion});
        datos.mes.forEach(element => {
          this.RegistroForm.get("brigadista_"+element.mes).patchValue(element.brigadista);
          this.RegistroForm.get("vacunacion_"+element.mes).patchValue(element.vacunador);
          this.RegistroForm.get("dengue_"+element.mes).patchValue(element.dengue);
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

  cargarDefault()
  {
    this.RegistroForm.patchValue({brigadista_generalizar: 0, vacunacion_generalizar: 0, dengue_generalizar: 0});
    for (let index = 1; index <= 12; index++) {
      this.RegistroForm.get("brigadista_"+index).patchValue(0);
      this.RegistroForm.get("vacunacion_"+index).patchValue(0);
      this.RegistroForm.get("dengue_"+index).patchValue(0);
    }
  }

  generalizar()
  {
    let brigadista  = this.RegistroForm.get("brigadista_generalizar").value;
    let vacunacion  = this.RegistroForm.get("vacunacion_generalizar").value;
    let dengue      = this.RegistroForm.get("dengue_generalizar").value;
    for (let index = 1; index <= 12; index++) {
      this.RegistroForm.get("brigadista_"+index).patchValue(brigadista);
      this.RegistroForm.get("vacunacion_"+index).patchValue(vacunacion);
      this.RegistroForm.get("dengue_"+index).patchValue(dengue);
    }
  }

  cancelar()
  {
    this.dialogRef.close(true);
  }

  guardar()
  {
    if(this.data.id != null)
    {
      this.servicioService.editarBrigadista(this.data.id, this.RegistroForm.value).subscribe(
        response =>{
          this.sharedService.showSnackBar("SE HA GUARDADO CORRECTAMENTE", null, 3000);
          this.cancelar();
        },
        errorResponse =>{
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        }
      );
    }else
    {
      this.servicioService.guardarBrigadista(this.RegistroForm.value).subscribe(
        response =>{
          this.sharedService.showSnackBar("SE HA GUARDADO CORRECTAMENTE", null, 3000);
          this.cancelar();
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

}
