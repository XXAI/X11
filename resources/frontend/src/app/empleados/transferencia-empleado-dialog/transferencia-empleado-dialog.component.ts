import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';
import { EmpleadosService } from '../empleados.service';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


export interface TransferenciaDialogData {
  id: number;
  cluesActual: string;
  crActual: string;
}

@Component({
  selector: 'transferencia-empleado-dialog',
  templateUrl: './transferencia-empleado-dialog.component.html',
  styleUrls: ['./transferencia-empleado-dialog.component.css']
})
export class TransferenciaEmpleadoDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TransferenciaEmpleadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransferenciaDialogData,
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    public dialog: MatDialog
  ) { }

  id:number;
  cluesActual:any;
  crActual:any;
  cluesCR: any = [{cr:'',descripcion:'Seleccione una clues'}];

  cluesForm = this.fb.group({
    clues: ['',Validators.required],
    cr: ['',Validators.required],
    observaciones: []
  });

  cluesLoading: boolean = false;
  filteredClues: Observable<any[]>;

  ngOnInit() {
    if(this.data.id){
      this.id = this.data.id;
      this.cluesActual = this.data.cluesActual;
      this.crActual = this.data.crActual;
    }
    
    this.cluesForm.get('clues').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => this.cluesLoading = true ),
      switchMap(value => this.empleadosService.buscarClues({query:value})
        .pipe(
          finalize(() => this.cluesLoading = false )
        )
      ),
    ).subscribe(items => this.filteredClues = items);
  }

  mostrarCR(clues){
    this.cluesCR = clues.cr;
    if(this.cluesCR.length == 1){
      this.cluesForm.get('cr').patchValue(this.cluesCR[0].cr);
    }else{
      this.cluesForm.get('cr').reset();
    }
  }

  isValid(){
    console.log(this.cluesForm.get('cr').value);
    if(this.cluesForm.valid){
      if(this.cluesForm.get('cr').value != this.crActual){ //this.cluesForm.get('clues').value.clues != this.cluesActual && 
        return true;
      }
    }
    return false;
  }

  transferir(){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Transferir Empleado',dialogMessage:'El empleado será transferido a : '+this.cluesForm.get('clues').value.nombre_unidad+', escriba TRANSFERIR para confirmar la transacción', validationString:'TRANSFERIR', btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        let params = {
          clues: this.cluesForm.get('clues').value.clues,
          cr: this.cluesForm.get('cr').value,
          observaciones: this.cluesForm.get('observaciones').value
        }
        this.empleadosService.transferirEmpleado(this.id,params).subscribe(
          response => {
            console.log(response);
            this.dialogRef.close(true);
          }
        );
      }else{
        console.log('cancelado');
      }
    });
  }

  displayFn(item: any) {
    if (item) { return item.nombre_unidad; }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}