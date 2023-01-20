import { LOGOS_CREDENCIAL } from "../../logos/credencial/iconos";


export class ReporteTrabajadorCredencialSalud{
    getDocumentDefinition(reportData:any) {
        let config = reportData.config;
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
              principal: {
                bold:true,
                color:"#FFFFFF",
                fontSize: 15
              },
              vigencia: {
                bold:true,
                color:"#FFFFFF",
                fontSize: 13
              },
              tipo_sangre: {
                bold:true,
                color:"#FFFFFF",
                fontSize: 10
              },
              datos_trabajador:
              {
                fontSize: 16,
                bold:true,
                alignment:"center",
                color:"#424142"
              },
              subtitulo:
              {
                fontSize: 12,
                alignment:"center",
                //bold:true,
                color: "#424142"
              },
              contacto:
              {
                fontSize: 11,
                alignment:"center",
                //bold:true,
                color: "#424142"
              }
             
            }
        };  

        let data:any = [];
        if(config.lote == false)
        {
          data.push(reportData.items);

        }else{
          data = reportData.items.data;
        }

        let iteraccion = 1;
        let bandera = 0;
        let tamano_arreglo = data.length;

        data.forEach(element => {
          let foto = "data:image/jpeg;base64,"+element.credencial.foto_trabajador;
          
          let id = String(element.id).padStart(6, "0");
          let area = "";
          let donador = "";
          
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
          }else
          {
            area = element.rel_datos_laborales.cr_fisico.descripcion_actualizada;
          }
          let margen_tabla = 112;
          let margen_imagen = 50;
          let clasificacion = "";

          if(element.rel_datos_laborales.clues_fisico)
          {
            clasificacion = element.rel_datos_laborales.clues_fisico.clasificacion_descripcion;
          }
          
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
              widths: [6, 68, 133, 105, 110],
              
              //heights: [1,8,30/*, 34, 10*/],
              body: [
                [ { image: formato, width: 444, absolutePosition: {x: 50, y: margen_imagen} }, {},{},{},{}
                ],
                
                [ {},{image: foto, width: 69, height: 83, rowSpan:5, margin:[0.5,4,0,0]},{text:"", margin:[0,3,0,0] },{},{}],
                [{},{},{text:"ID: "+id, style:"principal", margin:[0,0,0,1] },{},{}],
                [{},{},{text:"VIGENCIA: 31/12/23", style:"vigencia"},{},{}],
                [{},{},{text:clasificacion.toUpperCase(), style:"vigencia", margin:[0,2,0,1]},
                {qr: "https://rhid.saludchiapas.gob.mx/#/ssa/"+element.encriptar, fit: "70"/*,eccLevel:"L"/*, alignment: 'center', version:6*/, rowSpan:4, margin: [ 20,8,0,0 ]},
                {image: donador, width: 75, height: 75, alignment: 'center', margin: [ 0,0,0,0 ], rowSpan:4}],
                [{},{},{text:"TIPO DE SANGRE: "+tipo_sanguineo[element.credencial.tipo_sanguineo]+" RH "+signo_sanguineo[element.credencial.rh], margin:[0,3,0,0], style:"tipo_sangre"}
                ,{},
                {}],
                [{},{},{},{},{}],
                [{ text: element.nombre+"\n"+element.apellido_paterno+" "+element.apellido_materno, style: "datos_trabajador", colSpan:3 }, {}, {}, {}, {} ],
                [{ text: element.credencial.cargo.descripcion, style: "subtitulo", colSpan:3, margin: [ 2,4,2,0 ] }, {}, {}, {}, {} ],
                [{ text: area.toUpperCase(), style: "subtitulo", colSpan:3, margin: [ 2,4,2,0 ] }, {}, {}, {}, {} ],
                [{ text: "CONTACTO DE EMERGENCIA:", style: "contacto", colSpan:3, margin: [ 0,0,0,0 ]}, {}, {}, {}, {} ],
                [{ text: element.credencial.contacto.toUpperCase(), style: "contacto", colSpan:3 }, {}, {}, {}, {} ],
                [{ text: element.credencial.contacto_telefono, style: "contacto", colSpan:3 }, {}, {}, {}, {} ]
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