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
  selector: 'app-capacitacion-dialog',
  templateUrl: './capacitacion-dialog.component.html',
  styleUrls: ['./capacitacion-dialog.component.css']
})
export class CapacitacionDialogComponent implements OnInit {

  catalogos:any = [];
  cursoIsLoading: boolean = false;
  filteredCurso: Observable<any[]>;
  resultado:any = { estatus: false, datos:{}, dias:[]};
  texto_entidad_seleccionado:string = "";

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CapacitacionDialogComponent>,
    private trabajadorService: TrabajadorService,
    public mediaObserver: MediaObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public CapacitacionForm = this.fb.group({
    'entidad_id':['',Validators.required],
    'nombre_curso':['',Validators.required],
  });

  ngOnInit() {
    this.cargarEntidad();
    this.cargarBuscadores();
    console.log(this.data.editable);
    if(this.data.editable != null)
    {
      this.cargarEditable();
    }
  }

  cargarEditable():void
  {
    this.texto_entidad_seleccionado = this.data.editable.entidad_descripcion;
    this.CapacitacionForm.patchValue(this.data.editable);
  }

  cargarBuscadores():void
  { 
      this.CapacitacionForm.get('nombre_curso').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.cursoIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.cursoIsLoading = false; 
              let entidad = this.CapacitacionForm.get('entidad_id').value;
              let descripcion = this.CapacitacionForm.get('nombre_curso').value;
              if( entidad != '' && descripcion!="")
              {
                return this.trabajadorService.buscar({tipo: 8, query:value, entidad:entidad }).pipe(finalize(() => this.cursoIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.cursoIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredCurso = items);
  }

  cargarEntidad():void
  {
    this.catalogos = this.data.catalogos;
  }

  cancelar(): void {
    this.dialogRef.close(this.resultado);
  }

  guardar(): void {
    this.resultado.estatus = true;
    this.resultado.datos = this.CapacitacionForm.value;
    if(this.texto_entidad_seleccionado != "")
    {
      this.resultado.datos.entidad_descripcion = this.texto_entidad_seleccionado;
    }
    this.dialogRef.close(this.resultado);
  }

  obtener_texto(event) {
    let target = event.source.selected._element.nativeElement;
    this.texto_entidad_seleccionado = target.innerText.trim();
    this.CapacitacionForm.patchValue({nombre_curso:""});
  } 

  displayFn(item: any) {
    if (item) { return item.descripcion; }
  }

}
