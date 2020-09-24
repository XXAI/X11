import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadorService } from '../trabajador.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map, throwIfEmpty, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

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
    'titulo':['',Validators.required],
    'titulo_diploma_id':[''],
    'otro_titulo':[],
    'otro_nombre_titulo':[{ value:'', disabled:true}, Validators.required],
    'institucion':['',Validators.required],
    'otro_institucion':[''],
    'institucion_id':[],
    'otro_nombre_institucion':[{ value:'', disabled:true}, Validators.required],
    'cedula_profesional': ['',Validators.required],
    'no_cedula': [{ value:'', disabled:true}, Validators.required],
  });

  ngOnInit() {
    this.cargarBuscadores();
    this.cargarGrado();
    this.EstudiosForm.patchValue({cedula_profesional: 0});
  }

  cargarGrado():void
  {
    this.catalogos = this.data.catalogos;
    
  }

  
  cargarBuscadores():void
  { 
      this.EstudiosForm.get('titulo').valueChanges
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
              let descripcion = this.EstudiosForm.get('titulo').value;
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
      this.EstudiosForm.get('titulo').enable();
      this.EstudiosForm.get('otro_nombre_titulo').disable();
    }else{
      this.EstudiosForm.get('titulo').disable();
      this.EstudiosForm.get('otro_nombre_titulo').enable();
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
    this.resultado.datos.grado_estudios_descripcion = this.texto_grado_seleccionado;
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
