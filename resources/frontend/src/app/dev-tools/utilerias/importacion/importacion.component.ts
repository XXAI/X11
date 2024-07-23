import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { DevToolsService } from '../../dev-tools.service';
import * as FileSaver from 'file-saver';
import { SharedService } from '../../../shared/shared.service';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-importacion',
  templateUrl: './importacion.component.html',
  styleUrls: ['./importacion.component.css']
})
export class ImportacionComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  anios:Array<number> = [];
  file_store: FileList;
  relacionCampos:any[];
  controlCampos:any;
  isLoading:boolean = false;
  resumen:any = { base: 0, homologado:0, formalizado:0, regularizado:0, contrato:0, otro:0, nombre:'', peso:0, anio:'', quincena:0 };
  data:any[] = [];
  duplicados:any[] = [];
  camposFaltantes:any[] = [];
  correcto:boolean = false;
  incorrecto:Boolean = false;
  impresionReporte:boolean = false;

  constructor(private sharedService: SharedService,private _formBuilder: FormBuilder, private devToolsService:DevToolsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      archivo: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });

    this.relacionCampos = [
      { label:'RFC',                  key:'rfc_nomina'                },
      { label:'CURP',                 key:'curp_nomina'                 },
      { label:'NOMBRE',               key:'nombre_nomina'             },
      { label:'UR',                   key:'ur'                        },
      { label:'TIPO_PERSONAL',        key:'tipo_personal'             },
      { label:'PROGRAMA',             key:'programa'                  },
      { label:'CODIGO',               key:'codigo_puesto_id'          },
      { label:'PUESTO',               key:'descripcion_puesto'        }, 
      { label:'RAMA',                 key:'rama'                      }, 
      { label:'CLAVE PRESUPUESTAL',   key:'clave_presupuestal'        },       
      { label:'ZE',                   key:'ze'                        },       
      { label:'FIGF',                 key:'fecha_ingreso_federal'     },       
      { label:'FISSA',                key:'fecha_ingreso'             },       
      { label:'CR',                   key:'cr_nomina_id'              },       
      { label:'CLUES',                key:'clues_adscripcion_nomina'  },       
      { label:'QNA',                  key:'quincena'                  },       
      { label:'AÑO',                  key:'anio'                      },       
    ];

    this.controlCampos = {};
    this.relacionCampos.forEach(registro => {
      this.controlCampos[registro.label] = registro.key;

    });

  }

  imprimirReporte():void{
    
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'INFORMACIÓN',dialogMessage:'Este Modulo es para generar el reporte de sistematización, ¿Realmente quiere generarlo? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'aceptar'}
    });
    
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.impresionReporte = true;
        this.devToolsService.ExportarSistematizacion({}).subscribe(
          response => {
            /*FileSaver.saveAs(response,'Reporte-Sistematizacion');*/
            
            this.exportAsExcelFile(response.data, "BaseTrabajadores");
          },
          errorResponse =>{
            this.isLoading =false;
            this.impresionReporte = false;
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            //this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.impresionReporte = false;
          }
        );
      }else{
        this.isLoading =false;
      }
    });
    
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'TRABAJADORES': worksheet }, SheetNames: ['TRABAJADORES'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
    //this.loadReporteExcel = false;
    this.impresionReporte = false;
            
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_SSA_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  reiniciarVariables()
  {
    this.firstFormGroup.reset();
    this.data = []; 
  }

  handleFileInputChange(l: FileList): void {
    const f = l[0];

    if(f.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || f.type=="application/vnd.ms-excel" || f.type=="text/csv"){
      this.file_store = l;
      this.resumen.nombre = f.name;
      this.resumen.peso = (f.size / 1048576).toFixed(2);
      if (l.length) {
        this.firstFormGroup.patchValue({archivo: f.name});
        this.cargarDatosArchivo(null);
      } else {
        this.firstFormGroup.patchValue({archivo: ""});
      }
    }
  }

  cargarDatosArchivo(event: any){
    this.isLoading =  true;
    
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.file_store[0]);
    reader.onload = (e: any) => {
      // create workbook
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      // selected the first sheet 
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // save data
      const raw_data:any = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      if(raw_data.length > 0){
        let columnas_archivo:string[] = Object.keys(raw_data[0]);
        
        if(!this.validarCabeceras(columnas_archivo))
        {
          let errorMessage = "Existen Campos no Encontrados";
          this.sharedService.showSnackBar(errorMessage, null, 3000);
          this.isLoading =  false;
          return false;
        }

        let datos:any[] = raw_data.map(registro => {
          let seguimiento:any = {};
          if(registro.UR != 610)
          {
            columnas_archivo.forEach(columna => {
              /*if(columna == 'UR')
              {
                if(registro[columna] == 610)
                  {
                    return false;
                  }
              }*/
              if(columna == 'AÑO' && this.resumen.anio=='')
              {
                this.resumen.anio = registro[columna];
              }
              if(columna == 'QNA' && this.resumen.quincena == 0)
              {
                this.resumen.quincena = registro[columna];
              }
              if(this.controlCampos[columna])
              {
                seguimiento[this.controlCampos[columna]] = registro[columna];
                if(columna == 'UR')
                  {
                    switch (registro[columna]) {
                      case '420':
                      case '420_OPD': this.resumen.base++;   break;
                      case 'FOR':
                      case 'FO2':
                      case 'FO3': this.resumen.formalizado++;   break;
                      case 'REG': this.resumen.regularizado++;   break;
                      case 'CON': this.resumen.contrato++;   break;
                      case 'HOM': this.resumen.homologado++;   break;
                    
                      default: this.resumen.otro++; break;
                    }  
                  }
              }
            });  
          }else{
            return null;
          }
          
          return seguimiento;
        });

        //this.data = datos;
        let limite = 1000;
        let contador = 1;
        let arreglo:Array<any> = [];

        let arreglo_sin_ensenanza:Array<any> = datos.filter(x => x!=null);
        
        for (let index = 0; index < arreglo_sin_ensenanza.length; index++) {
          const element = arreglo_sin_ensenanza[index];
          
          arreglo.push(element);
          contador++;
          if(contador == limite)
          {
            this.data.push(arreglo);
            arreglo = [];
            contador = 1;
          }
          
        }
        if(arreglo.length > 0){
          this.data.push(arreglo);
        }
        this.isLoading =  false;
      }else{
        this.isLoading =  false;
        //this.alertPanel.showInfo('El archivo seleccionado esta vacío');
      }
    };  
  }

  validarCabeceras(cabecera)
  {
    let cantidad_campos:number = 17;
    let campos_correctos:number = 0;
    this.camposFaltantes = [];
    if(cabecera.length < cantidad_campos)
    {
      return false;
    }

    this.relacionCampos.forEach(element =>
      {
        if(cabecera.includes(element.label)){
          campos_correctos++;
        }else{
         this.camposFaltantes.push(element.label);
        }
      }
    );
    if(campos_correctos<cantidad_campos)
    {
      return false;
    }

    return true;

  }

  importar()
  {
    this.isLoading = true;
    let datos = { 
      nombre: this.resumen.nombre, 
      peso: this.resumen.peso, 
      anio: this.resumen.anio, 
      registros: (this.resumen.base + this.resumen.homologado + this.resumen.formalizado + this.resumen.regularizado + this.resumen.contrato + this.resumen.otro), 
      quincena: this.resumen.quincena, 
      datos: this.data 
    };
    
    this.devToolsService.importarData(datos).subscribe(
      response =>{
        this.isLoading = false;
        this.correcto = true;
        
      },
      error =>{
        this.incorrecto = true;
        this.isLoading = false;
        this.duplicados  = error.error.duplicado;
      }
    );
  }
}