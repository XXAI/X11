import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaludService } from '../salud.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ImageCroppedEvent, ImageCropperComponent }  from 'ngx-image-cropper';

export interface VerTrabajadorData {
  trabajador_id: number;
  nombre?:string;
  clues_id?:string;
  clues?:string;
  cr?:string;
  tipo_unidad?:number
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  catalogos:any = [];
  capacitacionIsLoading: boolean = false;
  filteredTitulo: Observable<any[]>;
  institucionIsLoading: boolean = false;
  filteredInstitucion: Observable<any[]>;
  resultado:any = { estatus: false, datos:{}, dias:[]};
  texto_grado_seleccionado:string = "";
  tituloIsLoading:boolean = false;
  nombre_trabajador:string = "";
  nombre_unidad:string = "";
  nombre_cr:string = "";
  FotoCredencial:File  = null;
  lugar_alternativo:boolean = true;
  
  tipo_sangre:any = [{id:1, descripcion:"A"}, {id:2, descripcion:"B"},{id:3, descripcion:"AB"}, {id:4, descripcion:"O"}];
  cargo:any = [{id:1, descripcion:"ADMINISTRATIVO"}];
  donador:any = [{id:1, descripcion:"SI"},{id:2, descripcion:"NO"}];
  capacidad_especial:any = [{id:1, descripcion:"SI"},{id:2, descripcion:"NO"}];

  imageChangedEvent: any = '';
  croppedImage: any = '';

  catalogo_cargo:any = [];

  datos_credencial:boolean =false;
     
  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FormularioComponent>,
    private saludService: SaludService,
    public mediaObserver: MediaObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  @ViewChild(ImageCropperComponent)imageCropper: ImageCropperComponent;

  public CredencialForm = this.fb.group({
    //'trabajador_id':['',Validators.required],
    'tipo_sangre_id':['',Validators.required],
    'signo':['',Validators.required],
    'cargo':['',Validators.required],
    'area':[''],
    'area_seleccion':[{ value:''}, Validators.required],
    'area_opcional':[''],
    'contacto':['',Validators.required],
    'contacto_telefono':['', Validators.required],
    'donador': ['',Validators.required],
    'capacidad_especial': ['', Validators.required],
  });

  ngOnInit(): void {
    
    this.nombre_trabajador = this.data.nombre;
    this.nombre_unidad = this.data.clues;
    if(this.data.cr != null)
    {
      this.nombre_cr += this.data.cr;
    }
    this.obtenerData();
    this.CredencialForm.patchValue({trabajador_id: this.data.trabajador_id, area: this.data.cr});
    //this.cargarAreasClues(this.data.clues_id);
    if(this.data.clues_id != "CSSSA017213")
    {
      this.lugar_alternativo = false;
      
    }
  }

  async obtenerData()
  {
    await this.saludService.getCargos({clues: this.data.clues_id}).subscribe(
      response =>{
        this.catalogos = response;
        /*let catalogo_edificio = [];
        let catalogo_unidad = [];
        response['cargo'].forEach(element => {
          
          if(element.id == 1)
          {
            catalogo_unidad.push(element);
          }

          if(this.data.tipo_unidad == 2 || this.data.tipo_unidad == 4 )
          {
            if(element.nivel == 1)
            {
              catalogo_edificio.push(element);
            }
          }else
          {
            if(element.nivel == 2)
            {
              catalogo_unidad.push(element);
            }
          }
        });
        if(this.data.tipo_unidad == 2 || this.data.tipo_unidad == 4 )
        {
          this.catalogo_cargo = catalogo_edificio;
        }else{
          this.catalogo_cargo = catalogo_unidad;
        }*/
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        //this.isLoading = false;
      }
    );
    this.saludService.buscarCredencial(this.data.trabajador_id, {}).subscribe(
      response =>{
        //this.dialogRef.close(true);
        if(response.data.credencial != null)
        {
          this.datos_credencial = true;
          let credencial = response.data.credencial;
          this.CredencialForm.patchValue(
            {
              tipo_sangre_id: credencial.tipo_sanguineo,
              signo: credencial.rh,
              cargo: credencial.cargo_id,
              area_opcional: credencial.area_opcional, 
              contacto: credencial.contacto,
              contacto_telefono: credencial.contacto_telefono,
              donador: credencial.donador_id,
              capacidad_especial: credencial.capacidad_especial_id
            }
          );
          if(credencial.foto == 1)
          {
            this.croppedImage = "data:image/png;base64,"+credencial.foto_trabajador;
          }
        }
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

  cancelar()
  {
    this.dialogRef.close(true);
  }

  guardar()
  {
    this.saludService.saveCredencial(this.data.trabajador_id, this.CredencialForm.value).subscribe(
      response =>{
        //this.dialogRef.close(true);
        this.sharedService.showSnackBar("SE HA GUARDADO CORRECTAMENTE", null, 3000);
        this.datos_credencial = true;
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

  subirFoto()
  {
    let data = {'trabajador_id': this.data.trabajador_id};
    this.saludService.upload(data, this.FotoCredencial, '').subscribe(
      response => {
        this.dialogRef.close(true);
        this.sharedService.showSnackBar("Ha subido correctamente el documento", null, 3000);
        //this.isLoading = false;
        //console.log(response);
      }, errorResponse => {
        //console.log(errorResponse);
        //console.log(errorResponse.error);
        this.sharedService.showSnackBar(errorResponse.error.error, null, 3000);
       // this.isLoading = false;
      });
  }

  cortar()
  {
    //console.log(this.imageCropper.crop());
    this.imageCropped(this.imageCropper.crop());
    
    //this.imageChangedEvent = this.imageCropper.crop().base64;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent);
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.FotoCredencial = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    );
      console.log(this.FotoCredencial);
    //const imageBlob = this.dataURItoBlob(this.imageUrl);
    //this.image = new File([imageBlob], this.imagename.name, { type: 'image/jpeg' });
    //this.imageselect = true;
  }

  base64ToFile(data, filename) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  
}
