import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComisionSindicalService } from '../comision-sindical.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

export interface VerEmpleadoData {
  id: number;
  nombre?:string;
}

@Component({
  selector: 'app-agregar-dialog',
  templateUrl: './agregar-dialog.component.html',
  styleUrls: ['./agregar-dialog.component.css']
})
export class AgregarDialogComponent implements OnInit {

  tipo_comision:any = [{id:0, descripcion: "Sin Comisión"},{id:1, descripcion: "Comisión Interna"},{id:2, descripcion: "Comisión Sindical"},{id:3, descripcion: "Licencia Humanitaría"},]
  crIsLoading:boolean = false;
  filteredCr: Observable<any[]>;
  catalogo_sindicato:any;
  trabajadorBusqueda:any;
  texto_tipo:string = "";
  texto_sindicato:string = "";
  resultado:any = { estatus: false, datos:{}};
  trabajador_id:any;
  nombre_trabajador:any;

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AgregarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerEmpleadoData,
    private comisionSindicalService: ComisionSindicalService,
    public mediaObserver: MediaObserver,
  ) { }

  public ComisionForm = this.fb.group({
    'buscador':     [''],
    'trabajador_id':     ['',Validators.required],
    'sindicato_id':     [{ value:'', disabled:false}, Validators.required],
    'no_documento':     [{ value:'', disabled:false}, Validators.required],
    'fecha_inicio':     ['',Validators.required],
    'fecha_fin':        ['',Validators.required]
  });

  ngOnInit() {
    this.cargarBuscadores();
    this.trabajador_id = this.data.id;
    this.nombre_trabajador = this.data.nombre;
    this.ComisionForm.patchValue({trabajador_id: this.trabajador_id});
  }

  obtener_texto_sindicato(event) {
    let target = event.source.selected._element.nativeElement;
    this.texto_sindicato = target.innerText.trim();
  } 

  cargarBuscadores():void
  {
      this.comisionSindicalService.buscar({tipo:10, query:''}).subscribe(
        response =>{
          this.catalogo_sindicato = response;
        },
        errorResponse =>{
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
          
        }
      );
  }

  buscarTrabajador(buscar:string)
  {
    console.log(buscar);
    
    this.comisionSindicalService.getTrabajador({busqueda_empleado: buscar}).subscribe(
      response =>{
        //this.dialogRef.close(true);
        this.trabajadorBusqueda = response.data;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.error){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
  }

  cancelar(): void {
    this.dialogRef.close(this.resultado);
  }

  guardar(): void {
    this.resultado.estatus = true;

    this.comisionSindicalService.guardar(this.ComisionForm.value).subscribe(
      response =>{
        this.dialogRef.close(true);
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.error){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
    
  }

  /* Displays functions */
  displayFn(item: any) {
    if (item) { return item.descripcion; }
  }

}
