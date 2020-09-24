import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-jornada-dialog',
  templateUrl: './jornada-dialog.component.html',
  styleUrls: ['./jornada-dialog.component.css']
})
export class JornadaDialogComponent implements OnInit {

  obj_inicio:any = new Date();
  resultado:any = { estatus: false, datos:{}, dias:[]};

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<JornadaDialogComponent>,
  ) { }

  public JornadaForm = this.fb.group({
    'horario_lunes':[], 
    'horario_martes':[], 
    'horario_miercoles':[], 
    'horario_jueves':[], 
    'horario_viernes':[], 
    'horario_sabado':[], 
    'horario_domingo':[], 
    'horario_festivo':[], 
    'hora_inicio':[{ value: ''}, Validators.required], 
    'hora_fin':[{ value:''}, Validators.required], 
  });

  ngOnInit() {
    this.JornadaForm.patchValue({hora_inicio: '08:00', hora_fin: '14:30'});
  }

  cancelar(): void {
    this.dialogRef.close(this.resultado);
  }

  guardar(): void {
    this.resultado.estatus = true;
    this.resultado.datos = this.JornadaForm.value;
    let dias_laborados = [];
    if(this.JornadaForm.get('horario_lunes').value){ dias_laborados.push(1); }
    if(this.JornadaForm.get('horario_martes').value){ dias_laborados.push(2); }
    if(this.JornadaForm.get('horario_miercoles').value){ dias_laborados.push(3); }
    if(this.JornadaForm.get('horario_jueves').value){ dias_laborados.push(4); }
    if(this.JornadaForm.get('horario_viernes').value){ dias_laborados.push(5); }
    if(this.JornadaForm.get('horario_sabado').value){ dias_laborados.push(6); }
    if(this.JornadaForm.get('horario_domingo').value){ dias_laborados.push(7); }
    if(this.JornadaForm.get('horario_festivo').value){ dias_laborados.push(8); }

    if(dias_laborados.length == 0)
    {
      this.sharedService.showSnackBar("Debe de seleccionar al menos 1 día", null, 3000);
    }else{
      this.resultado.dias = dias_laborados;
      this.dialogRef.close(this.resultado);
    }
  }
}
