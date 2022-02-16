import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

export interface VerTrabajadorData {
  trabajador_id: number;
  nombre?:string;
  estatus?:string;
  validado?:string;
  actualizado?:string;
  foto?:string;
  credencial?:string;
}

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {

  estatus:boolean = false;
  validado:boolean = false;
  actualizado:boolean = false;
  credencial:boolean = false;
  foto:boolean = false;
  nombre:string;

  constructor(
    private sharedService: SharedService, 
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetallesComponent>,
    public mediaObserver: MediaObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    if(this.data.estatus == 1)
    {
      this.estatus = true;
    }
    if(this.data.validado == 1)
    {
      this.validado = true;
    }
    if(this.data.actualizado == 1)
    {
      this.actualizado = true;
    }
    if(this.data.credencial != null)
    {
      this.credencial = true;
    }

    if(this.data.foto == 1)
    {
      this.foto = true;
    }
    this.nombre = this.data.nombre;

  }
  
  cerrar()
  {
    this.dialogRef.close(true);
  }
}
