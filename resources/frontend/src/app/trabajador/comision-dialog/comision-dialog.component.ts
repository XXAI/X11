import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadorService } from '../trabajador.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-comision-dialog',
  templateUrl: './comision-dialog.component.html',
  styleUrls: ['./comision-dialog.component.css']
})
export class ComisionDialogComponent implements OnInit {

  tipo_comision:any = [{id:0, descripcion: "Sin Comisión"},{id:1, descripcion: "Comisión Interna"},{id:2, descripcion: "Comisión Sindical"},{id:3, descripcion: "Licencia Humanitaría"},]
  crIsLoading:boolean = false;
  filteredCr: Observable<any[]>;
  catalogo_sindicato:any;
  texto_tipo:string = "";
  texto_sindicato:string = "";
  resultado:any = { estatus: false, datos:{}};

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ComisionDialogComponent>,
    private trabajadorService: TrabajadorService,
    public mediaObserver: MediaObserver,
  ) { }

  public ComisionForm = this.fb.group({
    'tipo_comision_id': ['',Validators.required],
    'cr':               [{ value:'', disabled:false}, Validators.required],
    'sindicato_id':     [{ value:'', disabled:false}, Validators.required],
    'no_documento':     [{ value:'', disabled:false}, Validators.required],
    'fecha_inicio':     ['',Validators.required],
    'fecha_fin':        ['',Validators.required],
    'recurrente':       [''],
    'meses':            [{ value:'', disabled:true}, Validators.required],
  });

  ngOnInit() {
    this.cargarBuscadores();
  }

  obtener_texto_tipo(event, value)
  {
    let target = event.source.selected._element.nativeElement;
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
    }
  }

  obtener_texto_sindicato(event) {
    let target = event.source.selected._element.nativeElement;
    this.texto_sindicato = target.innerText.trim();
  } 

  verificar_recurrente(check):void
  {
    //console.log(check)
    if(check)
    {
      this.ComisionForm.get('meses').enable(); 
    }else{
      this.ComisionForm.get('meses').disable();
    }
  }
  

  cargarBuscadores():void
  {
      this.ComisionForm.get('cr').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.crIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.crIsLoading = false;
              let entidad = this.ComisionForm.get('cr').value;
              if( entidad != '')
              {
                return this.trabajadorService.buscar({tipo:9, query:value }).pipe(finalize(() => this.crIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.crIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredCr = items);

      this.trabajadorService.buscar({tipo:10, query:''}).subscribe(
        response =>{
          console.log(response);
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
    this.resultado.datos = this.ComisionForm.value;
    if(this.texto_tipo != "")
    {
      this.resultado.datos.tipo_descripcion = this.texto_tipo;
    }
    
    if(this.texto_sindicato != "")
    {
      this.resultado.datos.sindicato_descripcion = this.texto_sindicato;
    }
    this.dialogRef.close(this.resultado);
  }

  /* Displays functions */
  displayFn(item: any) {
    if (item) { return item.descripcion; }
  }

}
