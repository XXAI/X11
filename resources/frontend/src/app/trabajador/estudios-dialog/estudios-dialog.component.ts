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
  selector: 'app-estudios-dialog',
  templateUrl: './estudios-dialog.component.html',
  styleUrls: ['./estudios-dialog.component.css']
})
export class EstudiosDialogComponent implements OnInit {

  catalogos:any = [];
  capacitacionIsLoading: boolean = false;
  filteredTitulo: Observable<any[]>;
  institucionIsLoading: boolean = false;
  filteredInstitucion: Observable<any[]>;
  resultado:any = { estatus: false, datos:{}, dias:[]};
  texto_grado_seleccionado:string = "";
  tituloIsLoading:boolean = false;
  
  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EstudiosDialogComponent>,
    private trabajadorService: TrabajadorService,
    public mediaObserver: MediaObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public EstudiosForm = this.fb.group({
    'grado_academico_id':['',Validators.required],
    'nombre_estudio':['',Validators.required],
    'otro_estudio':[],
    'otro_nombre_estudio':[{ value:'', disabled:true}, Validators.required],
    'institucion':['',Validators.required],
    'otro_institucion':[''],
    'otro_nombre_institucion':[{ value:'', disabled:true}, Validators.required],
    'cedula': ['',Validators.required],
    'no_cedula': [{ value:'', disabled:true}, Validators.required],
  });

  ngOnInit() {
    this.cargarBuscadores();
    this.cargarGrado();
    this.EstudiosForm.patchValue({cedula: 0});
    if(this.data.editable != null)
    {
      this.cargarEditable();
    }
  }

  cargarEditable():void
  {
    this.EstudiosForm.patchValue(this.data.editable);
    this.texto_grado_seleccionado = this.data.editable.grado_academico.descripcion;
    this.activar_otro_titulo(!this.data.editable.otro_estudio);
    this.activar_otro_institucion(!this.data.editable.otro_institucion);
    this.tiene_cedula(this.data.editable.cedula_profesional);
    this.tiene_cedula(this.data.editable.cedula);
  }

  cargarGrado():void
  {
    this.catalogos = this.data.catalogos;
  }

  
  cargarBuscadores():void
  { 
      this.EstudiosForm.get('nombre_estudio').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.capacitacionIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.capacitacionIsLoading = false; 
              let grado = this.EstudiosForm.get('grado_academico_id').value;
              let descripcion = this.EstudiosForm.get('nombre_estudio').value;
              if( grado != '' && descripcion!="")
              {
                return this.trabajadorService.buscar({tipo: 2, query:value, grado_academico:grado }).pipe(finalize(() => this.capacitacionIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.capacitacionIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredTitulo = items);
      
      this.EstudiosForm.get('institucion').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.institucionIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.institucionIsLoading = false; 
              let descripcion = this.EstudiosForm.get('institucion').value;
              if( descripcion!="")
              {
               
                return this.trabajadorService.buscar({tipo: 3, query:value}).pipe(finalize(() => this.institucionIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.institucionIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredInstitucion = items);

      /*this.EstudiosForm.get('carrera_ciclo').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.carreraIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.carreraIsLoading = false; 
              let descripcion = this.EstudiosForm.get('carrera_ciclo').value;
              if(descripcion!="")
              {
                console.log("entra");
                return this.trabajadorService.buscar({tipo: 4, query:value }).pipe(finalize(() => this.carreraIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.carreraIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredCarrera = items);*/

      
  }

  tiene_cedula(valor):void{
    if(valor == '0')
    {
      this.EstudiosForm.get('no_cedula').disable();
    }else if(valor == '1')
    {
      this.EstudiosForm.get('no_cedula').enable();
    }
  }

  activar_otro_titulo(valor)
  {
    if(valor){
      this.EstudiosForm.get('nombre_estudio').enable();
      this.EstudiosForm.get('otro_nombre_estudio').disable();
    }else{
      this.EstudiosForm.get('nombre_estudio').disable();
      this.EstudiosForm.get('otro_nombre_estudio').enable();
    }  
    
  }

  activar_otro_institucion(valor)
  {
    if(valor){
      this.EstudiosForm.get('institucion').enable();
      this.EstudiosForm.get('otro_nombre_institucion').disable();
    }else{
      this.EstudiosForm.get('institucion').disable();
      this.EstudiosForm.get('otro_nombre_institucion').enable();
    }   
  }

  cancelar(): void {
    this.dialogRef.close(this.resultado);
  }

  guardar(): void {
    this.resultado.estatus = true;
    this.resultado.datos = this.EstudiosForm.value;
    this.resultado.datos.grado_academico = { descripcion: this.texto_grado_seleccionado};
    //console.log(this.texto_grado_seleccionado);
    console.log(this.resultado);
    this.dialogRef.close(this.resultado);
  }

  obtener_texto(event) {
    let target = event.source.selected._element.nativeElement;
    this.texto_grado_seleccionado = target.innerText.trim();
  } 

  displayTituloFn(item: any) {
    if (item) { return item.descripcion; }
  }
  displayInstitucionFn(item: any) {
    if (item) { return item.descripcion; }
  }
}
