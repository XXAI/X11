import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfesionesService  } from '../profesiones.service';
import { SharedService } from '../../../shared/shared.service';

export interface ProfesionDialogData {
  id?: number;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfesionDialogData,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private profesionesService: ProfesionesService
  ) { }

  isSaving:boolean = false;
  isLoading:boolean = false;

  tiposProfesiones = <any>[];

  profesionId:number;
  tituloDialogo:string;

  profesionForm = this.fb.group({
    'tipo_profesion_id': ['',[Validators.required]],
    'descripcion': ['',[Validators.required]]
  });

  ngOnInit() {
    this.isLoading = true;

    this.profesionesService.obtenerCatalogoTipoProfesion().subscribe(
      response =>{
        console.log(response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.tiposProfesiones = response.data;
        }

        if(this.data.id){
          this.profesionId = this.data.id;
          this.tituloDialogo = 'Editar';
    
          this.profesionesService.verDatosProfesion(this.profesionId).subscribe(
            response => {
              console.log(response);
              if(response.error) {
                let errorMessage = response.error.message;
                this.sharedService.showSnackBar(errorMessage, null, 3000);
              } else {
                this.profesionForm.patchValue(response.data);
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
        }else{
          this.isLoading = false;
          this.tituloDialogo = 'Nueva';
        }
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

  cancel(): void {
    this.dialogRef.close();
  }

  guardar():void {
    if(this.profesionForm.valid){
      this.isSaving = true;
      if(this.profesionId){
        this.profesionesService.actualizarProfesion(this.profesionId,this.profesionForm.value).subscribe(
          response => {
            console.log(response);
            this.isSaving = false;
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              console.log('profesion editada');
              this.dialogRef.close(true);
            }
            //this.isLoading = false;
          },
          errorResponse =>{
            this.isSaving = false;
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            //this.isLoading = false;
          }
        );
      }else{
        this.profesionesService.crearProfesion(this.profesionForm.value).subscribe(
          response => {
            console.log(response);
            this.isSaving = false;
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              console.log('profesion creada');
              this.dialogRef.close(true);
            }
            //this.isLoading = false;
          },
          errorResponse =>{
            this.isSaving = false;
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            //this.isLoading = false;
          }
        );
      }
      //this.dialogRef.close(true);
    }
  }

}
