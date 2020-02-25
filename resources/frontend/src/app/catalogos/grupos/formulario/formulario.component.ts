import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { GruposService  } from '../grupos.service';
import { SharedService } from '../../../shared/shared.service';

export interface GrupoDialogData {
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
    @Inject(MAT_DIALOG_DATA) public data: GrupoDialogData,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private gruposService: GruposService
  ) { }

  isSaving:boolean = false;
  isLoading:boolean = false;

  grupoId:number;
  tituloDialogo:string;

  grupoForm = this.fb.group({
    'descripcion': ['',[Validators.required]],
    'finalizado': ['']
  });

  ngOnInit() {
    this.isLoading = true;

    if(this.data.id){
      this.grupoId = this.data.id;
      this.tituloDialogo = 'Editar';

      this.gruposService.verDatosGrupo(this.grupoId).subscribe(
        response => {
          console.log(response);
          if(response.error) {
            let errorMessage = response.error.message;
            this.sharedService.showSnackBar(errorMessage, null, 3000);
          } else {
            this.grupoForm.patchValue(response.data);
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
      this.tituloDialogo = 'Nuevo';
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  guardar():void {
    if(this.grupoForm.valid){
      this.isSaving = true;
      if(this.grupoId){
        this.gruposService.actualizarGrupo(this.grupoId,this.grupoForm.value).subscribe(
          response => {
            console.log(response);
            this.isSaving = false;
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              console.log('Grupo editado');
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
        this.gruposService.crearGrupo(this.grupoForm.value).subscribe(
          response => {
            console.log(response);
            this.isSaving = false;
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              console.log('Grupo creado');
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
