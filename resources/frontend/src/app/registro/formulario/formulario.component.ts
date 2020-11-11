import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { RegistroService } from '../registro.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPasswordDialogComponent } from '../confirm-password-dialog/confirm-password-dialog.component';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  isLoading:boolean = false;
  registro:string;

  public registroForm = this.fb.group({
   
    'rfc': ['',[Validators.required, Validators.minLength(13)]],
    'password': ['',[Validators.required, Validators.minLength(8)]],
    //'password_confirmacion': ['',[Validators.required, Validators.minLength(8)]],
    
  });

  constructor(private router: Router, 
              private sharedService: SharedService, 
              private fb: FormBuilder, 
              private registroService: RegistroService,
              public dialog: MatDialog) { }

  ngOnInit() {
    
  }

  enviar(){
    if(this.registroForm.valid){
      if(this.registroForm.get('password').value){
        this.confirmarContrasenia();
      }/*else{
        this.guardarUsuario();
      }*/
    }
  }

  confirmarContrasenia():void {
    const dialogRef = this.dialog.open(ConfirmPasswordDialogComponent, {
      width: '500px',
      data: {password: this.registroForm.get('password').value}
    });

    dialogRef.afterClosed().subscribe(validPassword => {
      if(validPassword){
        this.onSave();
      }
    });
  }

  onSave(){
    
    this.isLoading = true;
    this.registroService.registroTrabajador(this.registroForm.value.rfc, this.registroForm.value.password ).subscribe(
      response => {
        this.router.navigate(['/login']);
        this.sharedService.showSnackBar("Se ha registrado correctamente, intente ingresar", null, 3000);
        this.isLoading = false;
      }, error => {
        console.log(error);
        var errorMessage = "Error: Credenciales inválidas.";
        if(error.status != 401){
          errorMessage = "Verificar que no haya creado la cuenta previamente";
        }
        this.sharedService.showSnackBar(errorMessage, "Error", 3000);
        this.isLoading = false;
      }
    );
  }
}
