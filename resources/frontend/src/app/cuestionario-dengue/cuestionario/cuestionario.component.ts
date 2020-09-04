import { Component, OnInit, Inject,ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CuestionarioService } from '../cuestionario.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map, throwIfEmpty, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { InstruccionesComponent } from '../instrucciones/instrucciones.component';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit {

  @ViewChild('primer_video', {static: false})   videoplayer1: ElementRef;
  @ViewChild('segundo_video', {static: false})  videoplayer2: ElementRef;
  @ViewChild('tercer_video', {static: false})   videoplayer3: ElementRef;
  @ViewChild('cuarto_video', {static: false})   videoplayer4: ElementRef;

  participante = 0;
  calificacion_participante = 0;
  panel_registro      = true;
  panel_videos        = false;
  panel_cuestionario  = false;
  panel_calificacion = false;

  video_visto1 = 0;
  video_visto2 = 0;
  video_visto3 = 0;
  video_visto4 = 0;
  //
  duracion_video1 = 0;
  duracion_video2 = 0;
  duracion_video3 = 0;
  duracion_video4 = 0;

  
  distritos:any = [
    {id:1, nombre: "TUXTLA GUTIÉRREZ"},
    {id:2, nombre: "SAN CRISTOBAL DE LAS CASAS"},
    {id:3, nombre: "COMITAN"},
    {id:4, nombre: "VILLAFLORES"},
    {id:5, nombre: "PICHUCALCO"},
    {id:6, nombre: "PALENQUE"},
    {id:7, nombre: "TAPACHULA"},
    {id:8, nombre: "TONALA"},
    {id:9, nombre: "OCOSINGO"},
    {id:10, nombre: "MOTOZINTLA"}
];
  
sectores:any = [
    {id:1, nombre: "SSA"},
    {id:2, nombre: "IMSS"},
    {id:3, nombre: "ISSSTE"},
    {id:4, nombre: "ISSTECH"},
    {id:5, nombre: "SEDENA"},
    {id:6, nombre: "FUNDACION BEST"},
    {id:7, nombre: "FARMACIAS DEL AHORRO"},
    {id:8, nombre: "OTRO"}
];

perfiles:any = [
    {id:1, nombre: "MEDICO ESPECIALISTA"},
    {id:2, nombre: "MEDICO GENERAL"},
    {id:3, nombre: "ENFERMERA ESPECIALISTA"},
    {id:4, nombre: "ENFERMERA GENERAL"},
    {id:5, nombre: "TÉCNICA EN ENFERMERÍA"},
    {id:6, nombre: "TAPS"},
    {id:7, nombre: "OTRO"}
];
  constructor(
    private sharedService: SharedService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cuestionarioService: CuestionarioService,
    
  ) { }

  verificarForm = this.fb.group({
    'rfc': ['',[Validators.required]]
  });
  participanteForm = this.fb.group({
    'rfc': ['',[Validators.required]],
    'curp': ['',[Validators.required]],
    'nombre': ['',[Validators.required]],
    'celular': ['',[Validators.required]],
    'correo':['',[Validators.required,Validators.email]],
    'distrito':['',[Validators.required]],
    'unidad_medica':['',[Validators.required]],
    'sector': ['',[Validators.required]],
    'perfil': ['',[Validators.required]]
  });
  
  cuestionarioForm = this.fb.group({
    'pregunta1': ['',[Validators.required]],
    'pregunta2': ['',[Validators.required]],
    'pregunta3': ['',[Validators.required]],
    'pregunta4': ['',[Validators.required]],
    'pregunta5': ['',[Validators.required]],
    'pregunta6': ['',[Validators.required]],
    'pregunta7': ['',[Validators.required]],
    'pregunta8': ['',[Validators.required]],
    'pregunta9': ['',[Validators.required]],
    'pregunta10': ['',[Validators.required]],
  });

  
  
  ngOnInit() {
    this.ver_instrucciones();
    
  }

  accionGuardarParticipante(){
    let formData = JSON.parse(JSON.stringify(this.participanteForm.value));
   
    this.cuestionarioService.guardarParticipante(formData).subscribe(
      respuesta => {
        //console.log(respuesta);
        this.participante = respuesta.id;
        this.ver_videos();
        this.sharedService.showSnackBar("Se ha guardado correctamente", "Correcto", 3000);
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
  }

  accionVerificarAvance()
  {
    let formData = JSON.parse(JSON.stringify(this.verificarForm.value));
   
    this.cuestionarioService.verificarAvance(formData).subscribe(
      respuesta => {
        if(respuesta.data.realizado == 1)
        {
          this.ver_resultado(parseInt(respuesta.data.calificacion));
        }else{
          this.ver_videos();
          let videos = respuesta.data;
          this.video_visto1 = videos.video1;
          this.video_visto2 = videos.video2;
          this.video_visto3 = videos.video3;
          this.video_visto4 = videos.video4;
          this.participante = videos.id;
        }
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
  }
  accionGuardarCuestionario(){
    let formData = JSON.parse(JSON.stringify(this.cuestionarioForm.value));
    formData.participante_id = this.participante;
   //console.log(formData);
    this.cuestionarioService.guardarParticipanteCuestionario(formData).subscribe(
      respuesta => {
        this.ver_resultado(respuesta);
        this.sharedService.showSnackBar("Se ha guardado correctamente", "Correcto", 3000);
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
  }

  listen_video1():void 
  {
    let video_transcurrido = this.videoplayer1.nativeElement.currentTime;
    this.duracion_video1 = this.videoplayer1.nativeElement.duration;
    let porcentaje= ((video_transcurrido / this.duracion_video1) * 100);
    console.log(video_transcurrido);
    console.log(porcentaje);
    if(porcentaje > 99)
    {
      this.video_visto1 = 1;
      this.actualizacionVideos(1);
    }else{
      setTimeout (() => {
          this.listen_video1();
        }, 7000);
    }
  }
  listen_video2():void 
  {
    let video_transcurrido = this.videoplayer2.nativeElement.currentTime;
    this.duracion_video2 = this.videoplayer2.nativeElement.duration;
    let porcentaje= ((video_transcurrido / this.duracion_video2) * 100);
    console.log(video_transcurrido);
    console.log(porcentaje);
    if(porcentaje > 99)
    {
      this.video_visto2 = 1;
      this.actualizacionVideos(2);
    }else{
      setTimeout (() => {
          this.listen_video2();
        }, 7000);
    }
  }

  listen_video3():void 
  {
    let video_transcurrido = this.videoplayer3.nativeElement.currentTime;
    this.duracion_video3 = this.videoplayer3.nativeElement.duration;
    let porcentaje= ((video_transcurrido / this.duracion_video3) * 100);
    console.log(video_transcurrido);
    console.log(porcentaje);
    if(porcentaje > 99)
    {
      this.video_visto3 = 1;
      this.actualizacionVideos(3);
    }else{
      setTimeout (() => {
          this.listen_video3();
        }, 7000);
    }
  }
  listen_video4():void 
  {
    let video_transcurrido = this.videoplayer4.nativeElement.currentTime;
    this.duracion_video4 = this.videoplayer4.nativeElement.duration;
    let porcentaje= ((video_transcurrido / this.duracion_video4) * 100);
    console.log(video_transcurrido);
    console.log(porcentaje);
    if(porcentaje > 99)
    {
      this.video_visto4 = 1;
      this.actualizacionVideos(4);
    }else{
      setTimeout (() => {
          this.listen_video4();
        }, 7000);
    }
  }
  
  ver_instrucciones():void
  {
      const dialogRef = this.dialog.open(InstruccionesComponent, {
        width: '600px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
      });
  }

  

  play_video1() {
    this.videoplayer1.nativeElement.play();
    this.listen_video1();
  }
  
  pause_video1() {
    this.videoplayer1.nativeElement.pause();
  }

  play_video2() {
    this.videoplayer2.nativeElement.play();
    this.listen_video2();
  }
  
  pause_video2() {
    this.videoplayer2.nativeElement.pause();
  }

  play_video3() {
    this.videoplayer3.nativeElement.play();
    this.listen_video3();
  }
  
  pause_video3() {
    this.videoplayer3.nativeElement.pause();
  }
  play_video4() {
    this.videoplayer4.nativeElement.play();
    this.listen_video4();
  }
  
  pause_video4() {
    this.videoplayer4.nativeElement.pause();
  }
  
  accionVerCuestionario():void{
    //this.participante = 1;
    let formData = { 'participante' :this.participante };
    this.cuestionarioService.ver_cuestionario(formData).subscribe(
      respuesta => {
        //console.log(respuesta);
       if(respuesta.data == 1)
       {
        this.sharedService.showSnackBar("Ya ha ingresado una vez al cuestionario, por favor verificar.", null, 3000);
       }else{
        this.panel_registro      = false;
        this.panel_videos        = false;
        this.panel_cuestionario  = true;
        this.panel_calificacion = false;
       }
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
      
  }

  actualizacionVideos(video):void{
    //this.participante = 1;
    let formData = { 'participante' :this.participante, "video" :video };
    this.cuestionarioService.actualizarVideos(formData).subscribe(
      respuesta => {
       
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        
      }
    );
      
  }
  
  ver_resultado(calificacion):void{
      this.panel_registro      = false;
      this.panel_videos        = false;
      this.panel_cuestionario  = false;
      this.panel_calificacion = true;
      this.calificacion_participante = calificacion;
  }

  ver_videos():void{
    this.panel_registro      = false;
    this.panel_videos        = true;
    this.panel_cuestionario  = false;
    this.panel_calificacion = false;
  }
  
  
}
