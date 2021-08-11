import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DirectorioService } from '../directorio.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { AgregarPersonalComponent } from '../agregar-personal/agregar-personal.component';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface VerDataCR {
  CR: string;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})

export class VerComponent implements OnInit {

  isLoading: boolean = false;
  datos_clues:string = "";
  datos_cr:string = "";
  nombre_unidad:string = "";
  tipo_trabajador:any =  [{id:1, nombre:'JEFE, RESPONSABLE O DIRECTOR'},{id:2, nombre:'JEFE RECURSOS HUMANOS'},{id:3, nombre:'JEFE DE ADMINISTRACIÓN'}];

  displayedColumns: string[] = ['id','nombre','telefono','actions'];
  dataSource: any = [];

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<VerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerDataCR,
    private fb: FormBuilder,
    private directorioService: DirectorioService,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) { }

  public direccionForm = this.fb.group({
   
    'cr': ['',[Validators.required]],
    'direccion': ['',[Validators.required]],
    'municipio': ['',[Validators.required]],
    'telefono': ['',[Validators.required]],
    //'nombre_responsable': ['',[Validators.required]],
    //'cargo_responsable': ['',[Validators.required]],
    //'nombre_director': [''],
    //'cargo_director': [''],
  });
  ngOnInit(): void {
  //console.log(this.data);
    this.loadDataDirectorio();
  }

  loadDataDirectorio()
  {
    this.directorioService.getDirectorio(this.data.CR,'').subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          console.log(response);
          let data = response.data;
          

          this.nombre_unidad = data.descripcion;
          this.datos_clues = data.clues;
          this.datos_cr = data.cr;

          this.dataSource = data.directorio;
          /*if(data.directorio.length)
          {
            data.directorio.forEach(element => {
              if(element.tipo_responsable_id == 1)
              {
                nombre_responsable = element.nombre;
                cargo_responsable = element.cargo;
              }else if(element.tipo_responsable_id == 2)
              {
                nombre_director = element.nombre;
                cargo_director = element.cargo;
              }
            });
          }else
          {
            cargo_responsable = "JEFE DE "+data.descripcion;
            cargo_director = "DIRECTOR DE "+data.descripcion;
          }*/
           
          this.direccionForm.patchValue({cr:data.cr, direccion:data.direccion, municipio:data.municipio, telefono: data.telefono});
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
  }
  cancelar(): void {
    this.dialogRef.close();
  }

  guardarDirectorio()
  {
    console.log("entro");
    this.directorioService.guardarDirectorio(this.direccionForm.value).subscribe(
      response =>{
        console.log(response);
        this.sharedService.showSnackBar("Se ha Guardado Correctamente", null, 3000);
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      errorResponse =>{
        this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
        
      }
    );
  }
  agregarPersonal()
  {
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    this.sharedService.setDataToCurrentApp('paginator',paginator);

    let configDialog = {};
      configDialog = {
        width: '50%',
        //maxHeight: '50vh',
        //height: '400px',
        data:{CR: this.datos_cr, Unidad: this.nombre_unidad}
      }
  
    const dialogRef = this.dialog.open(AgregarPersonalComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
        this.loadDataDirectorio();
      }else{
        console.log('Cancelar');
      }
    });
  
  }
  eliminar(id)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea eliminar este trabajador como responsable? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.directorioService.eliminarResponsable(id,{cr: this.datos_cr}).subscribe(
          response =>{
            console.log(response);
            this.sharedService.showSnackBar("Se ha Actualizado Correctamente", null, 3000);
            this.isLoading = false;
            this.loadDataDirectorio();
          },
          errorResponse =>{
            this.isLoading = false;
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
            
          }
        );
      }
    });
  }

}
