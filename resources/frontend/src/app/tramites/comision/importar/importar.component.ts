import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ComisionService } from '../comision.service';
import { ImportarService } from '../../importar.service';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css'] 
})
export class ImportarComponent implements OnInit {
  status:number = 1;
  status_fase_1 =0;
  status_fase_2 =0;
  status_fase_3 =0;
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
  
  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private importarService: ImportarService,
    private comisionService: ComisionService,
    public dialogRef: MatDialogRef<ImportarComponent>) {}

    
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
    this.status_fase_1 = 1;
    this.indexTab = 1;
		this.importarService.uploadCsv(this.archivo, this.tipoformato.toString()).subscribe(
      response => {
        this.isLoading = false;
        this.status_fase_1 = 2;
        this.status = 2;
        this.cargarArchivo();
        
      }, errorResponse => {
        this.sharedService.showSnackBar(errorResponse.error.error, null, 3000);
        this.isLoading = false;
      });
  }

  cargarArchivo()
  {
    this.status_fase_2 = 1;
    this.comisionService.cargaArchivo({ tipo:this.tipoformato }).subscribe(
      response => {
        this.isLoading = false;
        this.status_fase_2 = 2;
        this.validarInformacion();
      }, errorResponse => {
        
        let ErrorString = errorResponse.error.error.message;
        this.isLoading = false;
        if(ErrorString.includes("offset"))
        {
          this.sharedService.showSnackBar("LA CANTIDAD DE CAMPOS NO COMPATIBLE CON LAYOUT", null, 3000);
        }else{
          this.sharedService.showSnackBar(ErrorString, null, 3000);
        }
        console.log(errorResponse);
      });
  }

  validarInformacion()
  {
    this.status_fase_3 = 1;
    this.comisionService.validarComisiones({ tipo: 1 }).subscribe(
      response => {
        this.isLoading = false;
        this.status_fase_3 = 2;
        this.indexTab = 2;
        this.status = 3;
        
        let datos = response.data;
        let index = 0;
       
        this.total = datos.total;
        this.correctos = datos.totalCorrectos;
        this.incorrectos = datos.totalIncorrectos;
        this.no_trabajadores = datos.totalNoTrabajadores;
        this.fechas = datos.totalFechas;
        this.no_nomina = datos.totalOrigen;
        this.no_destino = datos.totalDestino;
        this.igual_origen_destino = datos.totalOrigenDestino;
        this.duplicados = datos.totalDuplicado;
        this.comisionActiva = datos.totalComisionActiva;
        this.dataSource = datos.data;
        if(datos.totalCorrectos > 0)
        {
          this.Viableimportacion = true;
        }
      }, errorResponse => {
        
        let ErrorString = errorResponse.error.error.message;
        this.isLoading = false;
        if(ErrorString.includes("offset"))
        {
          this.sharedService.showSnackBar("LA CANTIDAD DE CAMPOS NO COMPATIBLE CON LAYOUT", null, 3000);
        }else{
          this.sharedService.showSnackBar(ErrorString, null, 3000);
        }
        console.log(errorResponse);
      });
  }
  cancelar(): void {
    this.dialogRef.close();
  }

  importar()
  {
    this.comisionService.importarComisiones({ tipo: 1 }).subscribe(
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
