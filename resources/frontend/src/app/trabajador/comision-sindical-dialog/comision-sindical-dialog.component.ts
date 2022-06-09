import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadorService } from '../trabajador.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

export interface VerEmpleadoData {
  id: number;
  nombre?:string;
}

@Component({
  selector: 'app-comision-sindical-dialog',
  templateUrl: './comision-sindical-dialog.component.html',
  styleUrls: ['./comision-sindical-dialog.component.css']
})

export class ComisionSindicalDialogComponent implements OnInit {

  tipo_comision:any = [{id:0, descripcion: "Sin Comisión"},{id:1, descripcion: "Comisión Interna"},{id:2, descripcion: "Comisión Sindical"},{id:3, descripcion: "Licencia Humanitaría"},]
  crIsLoading:boolean = false;
  filteredCr: Observable<any[]>;
  catalogo_sindicato:any;
  texto_tipo:string = "";
  texto_sindicato:string = "";
  resultado:any = { estatus: false, datos:{}};
  trabajador_id:any;
  nombre_trabajador:any;

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ComisionSindicalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerEmpleadoData,
    private trabajadorService: TrabajadorService,
    public mediaObserver: MediaObserver,
  ) { }

  public ComisionForm = this.fb.group({
    'trabajador_id':     [],
    'sindicato_id':     [{ value:'', disabled:false}, Validators.required],
    'no_documento':     [{ value:'', disabled:false}, Validators.required],
    'fecha_inicio':     ['',Validators.required],
    'fecha_fin':        ['',Validators.required]
  });

  ngOnInit() {
    this.cargarBuscadores();
    this.trabajador_id = this.data.id;
    this.nombre_trabajador = this.data.nombre;
    //console.log(this.data);
    this.ComisionForm.patchValue({trabajador_id: this.trabajador_id});
  }

  obtener_texto_tipo(event, value)
  {
    /*let target = event.source.selected._element.nativeElement;
    this.texto_tipo = target.innerText.trim();
    switch (value) {
      case 1:
        this.ComisionForm.get('cr').enable(); 
        this.ComisionForm.get('sindicato_id').disable();
        this.ComisionForm.patchValue({sindicato_id:0}); 
        this.texto_sindicato = "";
      break;
      case 2: 
        this.ComisionForm.get('cr').disable(); 
        this.ComisionForm.get('sindicato_id').enable();
        this.ComisionForm.patchValue({cr: []});  
      break;
      case 3: 
        this.ComisionForm.get('cr').disable(); 
        this.ComisionForm.get('sindicato_id').disable(); 
        this.ComisionForm.patchValue({recurrente: false, meses:'', sindicato_id:0, cr:[]});
        this.texto_sindicato = "";
        
      break;
    }*/
  }

  obtener_texto_sindicato(event) {
    let target = event.source.selected._element.nativeElement;
    this.texto_sindicato = target.innerText.trim();
  } 

  

  cargarBuscadores():void
  {
      this.trabajadorService.buscar({tipo:10, query:''}).subscribe(
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

  cancelar(): void {
    this.dialogRef.close(this.resultado);
  }

  guardar(): void {
    this.resultado.estatus = true;

    //console.log(this.ComisionForm.value);
    this.trabajadorService.guardarComisionSindical(this.ComisionForm.value).subscribe(
      response =>{
        //this.dialogRef.close(true);
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
