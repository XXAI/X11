import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap, finalize, startWith, map } from 'rxjs/operators';
import { TrabajadorService } from '../trabajador.service';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
//import { Console } from 'node:console';

export interface TransferenciaDialogData {
  id: number;
  cluesActual: string;
  crActual: string;
}

@Component({
  selector: 'app-transferencia-trabajador-dialog',
  templateUrl: './transferencia-trabajador-dialog.component.html',
  styleUrls: ['./transferencia-trabajador-dialog.component.css']
})

export class TransferenciaTrabajadorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TransferenciaTrabajadorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransferenciaDialogData,
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService,
    public dialog: MatDialog
  ) { }

  id:number;
  //cluesActual:any;
  crActual:any;
  cluesCR: any = [{cr:'',descripcion:'Seleccione una clues'}];

  cluesForm = this.fb.group({
    //clues: ['',Validators.required],
    cr: ['',Validators.required],
    observaciones: []
  });

  crLoading: boolean = false;
  filteredClues: Observable<any[]>;

  filteredCluesCR: Observable<any[]>;

  ngOnInit() {
    if(this.data.id){
      this.id = this.data.id;
      //this.cluesActual = this.data.cluesActual;
      this.crActual = this.data.crActual;
    }

    this.cargarBuscador();
    
  }

  cargarBuscador()
  {
      this.cluesForm.get('cr').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.crLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.crLoading = false;
                return this.trabajadorService.buscarClues({ query:value }).pipe(finalize(() => this.crLoading = false ));
               
            }else{
              this.crLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredCluesCR = items);
  }

  getDisplayFn(item: any) {
    if (item) { return item.descripcion; }
  }

  isValid(){
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
      data:{dialogTitle:'Transferir Empleado',dialogMessage:'El empleado será transferido a : '+this.cluesForm.get('cr').value.descripcion+', escriba TRANSFERIR para confirmar la transacción', validationString:'TRANSFERIR', btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        let params = {
          cr: this.cluesForm.get('cr').value,
          observaciones: this.cluesForm.get('observaciones').value
        }
        
        this.trabajadorService.transferirTrabajador(this.id,params).subscribe(
          response => {
            //console.log(response);
            this.dialogRef.close(true);
          }
        );


      }else{
        console.log('cancelado');
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}
