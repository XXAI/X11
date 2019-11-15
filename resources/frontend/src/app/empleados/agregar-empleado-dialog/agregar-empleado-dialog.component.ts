import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'agregar-empleado-dialog',
  templateUrl: './agregar-empleado-dialog.component.html',
  styleUrls: ['./agregar-empleado-dialog.component.css']
})
export class AgregarEmpleadoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AgregarEmpleadoDialogComponent>
  ) { }

  ngOnInit() {
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  aceptar(): void {
    this.dialogRef.close(true);
  }
}