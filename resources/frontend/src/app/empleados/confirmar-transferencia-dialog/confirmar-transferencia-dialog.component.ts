import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

export interface ConfirmarTransferenciaDialogData {
  id?: number;
}

@Component({
  selector: 'app-confirmar-transferencia-dialog',
  templateUrl: './confirmar-transferencia-dialog.component.html',
  styleUrls: ['./confirmar-transferencia-dialog.component.css']
})
export class ConfirmarTransferenciaDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmarTransferenciaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmarTransferenciaDialogData,
    private fb: FormBuilder,
  ) { }

  id:number;
  catalogos:any = {
    'clues':[],
    'cr':[]
  };

  estudiosForm = this.fb.group({
    'empleado_id': [''],
    'clues': [''],
    'cr':['']
  });

  ngOnInit() {
    if(this.data.id){
      this.id = this.data.id;
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    this.dialogRef.close(true);
  }
}