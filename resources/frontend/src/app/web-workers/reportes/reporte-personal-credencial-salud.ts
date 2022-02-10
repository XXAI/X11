//import { LOGOS } from "../../logos";
import { LOGOS_CREDENCIAL } from "../../logos/credencial/iconos";
import * as CryptoJS from 'crypto-js';

export class ReporteTrabajadorCredencialSalud{
    getDocumentDefinition(reportData:any) {
        //console.log("entro");
        //Variables Generales
        
        let config = reportData.config;
        let distrito:any[] = ['','I','II','III','IV','V', 'VI', 'VII', 'VIII','IX','X', 'I'];
        let region:any[] = ['','TUXTLA', "SCLC", "COMITAN", "VILLAFLORES", "PICHUCALCO", "PALENQUE", "TAPACHULA", "TONALA", "OCOSINGO", "MOTOZINTLA", "ESTATAL"];
        let tipo_sanguineo:any[] =  ["", "A", "B", "AB", "O", "A1", "A2"];
        let signo_sanguineo:any[] =  ["", "-", "+"];
        let formato = "data:image/jpeg;base64,"+reportData.formato;

        
        //Configuracion del archivo
        let datos = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
          pageMargins: [ 40, 60, 40, 60 ],
        
          content: [],
            styles: {
              cabecera: {
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              
              datos_trabajador:
              {
                fontSize: 16,
                bold:true,
                alignment:"center"
              },
              subtitulo:
              {
                fontSize: 12,
                alignment:"center",
                bold:true
              },
              arriba_credencial_datos:
              {
                fontSize: 8,
                bold:true,
                color:"#FFFFFF",
                alignment:"center"
              },
              distrito:
              {
                fontSize: 10,
                bold:true,
                color:"#FFFFFF",
                alignment:"center"
              },
              no_distrito:
              {
                fontSize: 30,
                bold:true,
                color:"#FFFFFF",
                alignment:"center"
              },
              no_distrito_central:
              {
                fontSize: 26,
                bold:true,
                color:"#FFFFFF",
                alignment:"center"
              },
              tabla_datos:
              {
                fontSize: 30,
              }
              ,
              espacio:
              {
                  fillColor:"#FF0000",
              },
              laterales:
              {
                bold:true,
                color:"#FFFFFF",
                alignment:"center",
                
              },
              qr_style:
              {
                fontSize: 10,
                alignment:"center"
              }
            }
        };  

        let data:any = [];
        if(config.lote == false)
        {
          data.push(reportData.items);
          //data.push(reportData.items);
          //data.push(reportData.items);
        }else{
          data = reportData.items;
        }


        let iteraccion = 1;
        let bandera = 0;
        let tamano_arreglo = data.length;

        data.forEach(element => {
          let letras_distrito = "DISTRITO";
          let foto = "data:image/jpeg;base64,"+element.credencial.foto_trabajador;
          let imagen_tipo_unidad = "";
          let estilo_distrito = "no_distrito";
          let letra_distrito = distrito[parseInt(element.rel_datos_laborales.clues_fisico.cve_jurisdiccion)];
          
          let palabra = region[parseInt(element.rel_datos_laborales.clues_fisico.cve_jurisdiccion)];
          let longitud:number = 0;
          let id = String(element.id).padStart(6, "0");
          let area = "";
          let donador = "";
          //let rfc_encript = CryptoJS.AES.encrypt(element.rfc, "%ubp$$BG%kU0")
          //console.log(element.rel_datos_laborales);
          switch(parseInt(element.rel_datos_laborales.clues_fisico.cve_jurisdiccion))
          {
            case 1: longitud = 12; break;
            case 2: longitud = 16; break;
            case 3: longitud = 10; break;
            case 4: longitud = 6; break;
            case 5: longitud = 7; break;
            case 6: longitud = 9; break;
            case 7: longitud = 8; break;
            case 8: longitud = 12; break;
            case 9: longitud = 9; break;
            case 10: longitud = 7; break;
            case 11: longitud = 10; break;
            
          }

          if(element.credencial.donador_id == 1)
          {
            donador = LOGOS_CREDENCIAL[1].donador_si;
          }else{
            donador = LOGOS_CREDENCIAL[1].donador_no;
          }

          if(element.rel_datos_laborales.clues_adscripcion_fisica == "CSSSA017213")
          {
            area = element.rel_datos_laborales.cr_fisico.descripcion;
            area += "\n"+element.rel_datos_laborales.clues_fisico.nombre_unidad;
            letras_distrito = "\n";
            estilo_distrito = "no_distrito_central";
            letra_distrito = "OFC";
          }else
          {
            area = element.rel_datos_laborales.cr_fisico.descripcion;
          }
          /*if(element.credencial.area_opcional != null && element.credencial.area_opcional!= '')
          {
            area = element.credencial.area_opcional;
          }else
          {
            area = element.rel_datos_laborales.cr_fisico.descripcion;
          }

          if(area != element.rel_datos_laborales.clues_fisico.nombre_unidad)
          {
            area += "\n"+element.rel_datos_laborales.clues_fisico.nombre_unidad;
          }*/


          switch(element.rel_datos_laborales.clues_fisico.tipo_unidad_id)
          {
            case 1: imagen_tipo_unidad = LOGOS_CREDENCIAL[0].centro_salud; break;
            case 2: imagen_tipo_unidad = LOGOS_CREDENCIAL[0].distrito; break;
            case 3: imagen_tipo_unidad = LOGOS_CREDENCIAL[0].hospital; break;
            case 4: imagen_tipo_unidad = LOGOS_CREDENCIAL[0].oficina; break;
            case 5: imagen_tipo_unidad = LOGOS_CREDENCIAL[0].dipris; break;
          }
         
          let margen_tabla = 112;
          let margen_imagen = 50;
          

          if(iteraccion%2 == 0)
          {
            margen_tabla = 462;
            margen_imagen = 400;
            bandera = 1;
          }

          let informacion_credencial = {
            layout: 'noBorders',
            pageBreak:'',
            //margin: [11,margen_tabla,0,0],
            absolutePosition: {x: 50, y: margen_tabla},
            table: {
              widths: [12, 51, 68, 48, 10, 105, 110],
              
              //heights: [1,8,30/*, 34, 10*/],
              body: [
                [
                  { image: formato, width: 455, absolutePosition: {x: 50, y: margen_imagen} },
                  { },
                  {  }, 
                  { },
                  { },
                  { }, {},
                ],
                [
                  { text: this.recorrer_palabra(palabra), rowSpan:3, fontSize:(longitud), style: "laterales"},
                  { text: letras_distrito, style: "distrito"},
                  { image: foto, width: 70, height: 86, rowSpan:3, margin:[0,0,0,0] }, 
                  { text: "", style: "arriba_credencial_datos"},
                  { text: "ID\n"+this.recorrer_palabra(id), rowSpan:3, style: "laterales",fontSize:10},
                  { text: "", rowSpan:2, style: "tabla_datos"}, {},
                ],
                [
                  {},{ text: letra_distrito, style: estilo_distrito },{},
                  { text: "VIGENCIA:\n31/DIC/22", style: "arriba_credencial_datos"}, {}, {}, {}
                ],
                [
                  {}, { image: imagen_tipo_unidad, width: 30, height: 35, alignment: 'center' }, {},
                  { text: "TIPO SANGRE:\n"+tipo_sanguineo[element.credencial.tipo_sanguineo]+" RH "+signo_sanguineo[element.credencial.rh], margin: [ 0,4,0,0 ], style: "arriba_credencial_datos"},
                  {}, {qr: "https://funcionarios.saludchiapas.gob.mx/#/ssa/"+element.encriptar, fit: "70"/*,eccLevel:"L"/*, alignment: 'center', version:6*/, rowSpan:4, margin: [ 20,7,0,0 ]}, 
                { image: donador, width: 75, height: 75, alignment: 'right', margin: [ 0,2,2,0 ], rowSpan:5 },
                ],
                [
                  {},{},{},{},{},{},{},
                ],
                [{ text: element.nombre+"\n"+element.apellido_paterno+" "+element.apellido_materno, style: "datos_trabajador", colSpan:5 }, {}, {}, {}, {}, {}, {} ],
                [{ text: element.credencial.cargo.descripcion, style: "subtitulo", colSpan:5, margin: [ 0,4,0,0 ] }, {}, {}, {}, {}, {}, {} ],
                [{ text: area.toUpperCase(), style: "subtitulo", colSpan:5, margin: [ 0,4,0,0 ] }, {}, {}, {}, {}, {}, {} ],
                [{ text: "CONTACTO DE EMERGENCIA:", style: "subtitulo", colSpan:5, margin: [ 0,4,0,0 ] }, {}, {}, {}, {}, {}, {} ],
                [{ text: element.credencial.contacto.toUpperCase(), style: "subtitulo", colSpan:5 }, {}, {}, {}, {}, {}, {} ],
                [{ text: element.credencial.contacto_telefono, style: "subtitulo", colSpan:5 }, {}, {}, {}, {}, {}, {} ]
              ]
            }
            
          }

          if(bandera == 1 && iteraccion%2 == 0 && tamano_arreglo > iteraccion)
          {
            informacion_credencial.pageBreak = 'after';
          }

          datos.content.push(informacion_credencial);
          iteraccion++;
        });
        
        
        return datos;
      }

      recorrer_palabra(palabra:string)
      {
        let palabra_completa:string = "";
        for (var i = 0; i< palabra.length; i++) {
          var caracter = palabra.charAt(i);
          palabra_completa+=caracter+"\n";
        }
        return palabra_completa;
      }
}