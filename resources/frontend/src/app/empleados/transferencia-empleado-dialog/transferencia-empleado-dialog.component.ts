import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

export interface TransferenciaDialogData {
  id: number;
}

@Component({
  selector: 'transferencia-empleado-dialog',
  templateUrl: './transferencia-empleado-dialog.component.html',
  styleUrls: ['./transferencia-empleado-dialog.component.css']
})
export class TransferenciaEmpleadoDialogComponent implements OnInit {

  id:number;
  catalogos:any = {
    'clues':[]
  };

  constructor(
    public dialogRef: MatDialogRef<TransferenciaEmpleadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransferenciaDialogData,
  ) { }

  ngOnInit() {
    if(this.data.id){
      this.id = this.data.id;
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  transferir(): void {
    this.dialogRef.close(true);
  }
}