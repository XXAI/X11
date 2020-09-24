import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-estudios-dialog',
  templateUrl: './estudios-dialog.component.html',
  styleUrls: ['./estudios-dialog.component.css']
})
export class EstudiosDialogComponent implements OnInit {

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EstudiosDialogComponent>,
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
  }

}
