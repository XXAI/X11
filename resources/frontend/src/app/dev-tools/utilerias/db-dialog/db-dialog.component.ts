import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { DevToolsService } from '../../dev-tools.service';
import { ImportarService } from '../../../tramites/importar.service';

@Component({
  selector: 'app-db-dialog',
  templateUrl: './db-dialog.component.html',
  styleUrls: ['./db-dialog.component.css']
})
export class DbDialogComponent implements OnInit {
  status:number = 1;
  
  iconEstatus:any = ['timer_off', 'timer', 'check_box'];
  datosArchivo:any = {nombre:'---', tamano:0, tipo:'---'};
  fileChangedEvent: any = '';
  form: FormGroup;
  isLoading: boolean;
  archivo: File = null;
  indexTab:number = 0;
  displayedColumns: string[] = ['nombre', 'observacion'];
  dataSource:any = [];

  total:Number = 0;
  correctos:Number = 0;
  incorrectos:Number = 0;
  no_trabajadores:Number = 0;
  fechas:Number = 0;
  no_nomina:Number = 0;
  no_destino:Number = 0;
  igual_origen_destino:Number = 0;
  duplicados:Number = 0;
  comisionActiva:Number = 0;
  Viableimportacion:boolean = false;
  tipoformato:number  = 1;

  constructor(private sharedService: SharedService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private importarService: ImportarService,
    private devToolsService: DevToolsService,
    public dialogRef: MatDialogRef<DbDialogComponent>) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        file: ['', Validators.required],
      }
    );
  }

  fileChange(event: any): void {
    this.archivo = null;
    this.fileChangedEvent = event;
    if(this.fileChangedEvent.target)
    {
      if(this.fileChangedEvent.target.files.length)
      {
        if(this.fileChangedEvent.target.files[0])
        {
          let registro = this.fileChangedEvent.target.files[0];
          if(registro.type == "text/csv")
          {
            this.datosArchivo.nombre = registro.name;
            this.datosArchivo.tamano = registro.size / 1000;
            this.datosArchivo.tipo = registro.type;

            let fileList: FileList = event.target.files;
            if (fileList.length > 0) {
              this.archivo = <File>fileList[0];
            }else{
              this.sharedService.showSnackBar("Error, archivo vacio", null, 3000);
              this.fileChangedEvent = "";
              this.form.patchValue({file:''});
            }
          }else{
            this.sharedService.showSnackBar("Error, formato incorrecto del archivo", null, 3000);
            this.fileChangedEvent = "";
            this.form.patchValue({file:''});
          }
          
        }else{
          this.sharedService.showSnackBar("Error al importar el archivo", null, 3000);
          this.fileChangedEvent = "";
          this.form.patchValue({file:''});
        }
      }else{
        this.sharedService.showSnackBar("Error al importar el archivo", null, 3000);
        this.fileChangedEvent = "";
        this.form.patchValue({file:''});
      }
    }else{
      this.sharedService.showSnackBar("Error al importar el archivo", null, 3000);
      this.fileChangedEvent = "";
      this.form.patchValue({file:''});
    }
  }

  subir()
  {
    this.indexTab = 1;
		this.importarService.uploadDB(this.archivo).subscribe(
      response => {
        this.isLoading = false;
        //this.status = 2;
        this.cargarBase();
      }, errorResponse => {
        this.sharedService.showSnackBar(errorResponse.error.error, null, 3000);
        this.isLoading = false;
      });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  cargarBase()
  {
    this.devToolsService.cargarBase().subscribe(
      response => {
        this.isLoading = false;
        //this.status = 2;
        this.cargarBase();
      }, errorResponse => {
        this.sharedService.showSnackBar(errorResponse.error.error, null, 3000);
        this.isLoading = false;
      });
  }


  importar()
  {
    this.devToolsService.importarDB({ tipo: 1 }).subscribe(
      response => {
        this.sharedService.showSnackBar("SE HA IMPORTADO CORRECTAMENTE LOS REGISTROS", null, 3000);
        this.dialogRef.close(true);
      }, errorResponse => {
        
        let ErrorString = errorResponse.error.error.message;
        this.isLoading = false;
        this.sharedService.showSnackBar("ERROR AL IMPORTAR LOS DATOS", null, 3000);
      });
  }

}
