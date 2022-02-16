import { exit } from "process";
import { LOGOS } from "../../logos";


export class ReporteTrabajadorCambioAdscripcion {

    getDocumentDefinition(reportData:any) {
          
        let data = reportData.items;
        let nombres = reportData.responsable;
        
        let director = nombres.direccion_admon.responsable;
        let nombre_director = director.nombre+" "+director.apellido_paterno+" "+director.apellido_materno;
        
        let control = nombres.control.responsable;
        let nombre_control = control.nombre+" "+control.apellido_paterno+" "+control.apellido_materno;

        let relaciones_laborales = nombres.relaciones_laborales.responsable;
        let nombre_relaciones_laborales = relaciones_laborales.nombre+" "+relaciones_laborales.apellido_paterno+" "+relaciones_laborales.apellido_materno;

        let sistematizacion = nombres.sistematizacion.responsable;
        let nombre_sistematizacion = sistematizacion.nombre+" "+sistematizacion.apellido_paterno+" "+sistematizacion.apellido_materno;

        let subdireccion_rh = nombres.subdireccion_rh.responsable;
        let nombre_subdireccion_rh = subdireccion_rh.nombre+" "+subdireccion_rh.apellido_paterno+" "+subdireccion_rh.apellido_materno;

        let secretario = nombres.secretario.responsable;
        let nombre_secretario = secretario.nombre+" "+secretario.apellido_paterno+" "+secretario.apellido_materno;

        let elaboracion = nombres.elaboracion;
        let nombre_elaboracion = "";
        if(elaboracion != null)
        {
          nombre_elaboracion = "ELABORÓ: "+elaboracion.nombre+" "+elaboracion.apellido_paterno+" "+elaboracion.apellido_materno;
        }
        let fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());

        let datos = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            columns: [
                {
                    image: LOGOS[0].LOGO_FEDERAL,
                    width: 90
                },
                {
                    margin: [10, 0, 0, 0],
                    // text: 'SECRETARÍA DE SALUD\n'+reportData.config.title,
                    text: '\n"2022, AÑO DE RICARDO FLORES MAGÓN"',

                    bold: false,
                    fontSize: 9,
                    alignment: 'center'
                },
                {
                  image: LOGOS[1].LOGO_ESTATAL,
                  width: 80
                }
            ]
          },
          footer: function(currentPage, pageCount) { 
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount; 
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'Unidad Administrativa. Edificio "C" Col. Maya. C.P. 29010, Tuxtla Gutiérrez, Chiapas.\n'+'Conmutador (961) 6189250 '+' www.saludchiapas.gob.mx/',
                      alignment:'left',
                      fontSize: 7,
                  },
                  // {
                  //     margin: [10, 0, 0, 0],
                  //     text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                  //     fontSize: 7,
                  //     alignment: 'center'
                  // },
                  {
                    text: fecha_hoy.toString(),
                    alignment:'right',
                    fontSize: 7,
                }
              ]
            }
          },

          content: [],

            styles: {
              cabecera: {
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 5,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 10
              },
              tabla_datos:
              {
                fontSize: 5
              },
              texto_depto:
              {
                bold: true,
                alignment:"left",
                fontSize: 12,
              },
              texto_independencia:
              {
                bold: false,
                //italic : true,
                alignment:"center",
                fontSize: 9
              },
              texto_firmas:
              {
                bold: true,
                alignment:"left",
                fontSize: 6,
              },
              texto_num_oficio:
              {
                bold: true,
                alignment:"right",
                fontSize: 9
              },
              texto_leyenda:
              {
                bold: false,
                alignment:"justify",
                fontSize: 10
              },

            }
        };

        let iteracciones = 1;
        data.forEach(element => {

          let contenido = "";
          let datos_trabajador = element.trabajador;
          let dato_desde = "";
          let dato_hacia = "";
          let jurisdiccion_igual = "";

          
          
          if(element.cr_origen.cr_dependencia == element.cr_destino.cr_dependencia)
          {
            if(element.cr_origen.cr_dependencia != element.cr_origen.cr && element.cr_destino.cr_dependencia != element.cr_destino.cr )
            {
              jurisdiccion_igual = " ambas dependientes de "+element.cr_origen.dependencia.descripcion_actualizada+", ";
            }else{
              if(element.cr_origen.cr_dependencia != element.cr_origen.cr && element.cr_destino.cr_dependencia != element.cr_destino.cr)
              {
                dato_desde =" dependiente de "+ element.cr_origen.dependencia.descripcion_actualizada;
              }
              if(element.cr_destino.cr_dependencia != element.cr_destino.cr){
                dato_hacia = " dependiente de la misma jurisdicción";
              }
            }
            
          }else{
            if(element.cr_origen.cr_dependencia != element.cr_origen.cr){
              dato_desde =" dependiente de "+ element.cr_origen.dependencia.descripcion_actualizada;
            }
            if(element.cr_destino.cr_dependencia != element.cr_destino.cr){
              dato_hacia = " dependiente de "+element.cr_destino.dependencia.descripcion_actualizada;
            }
          }

          dato_desde = element.cr_origen.descripcion_actualizada+" ("+element.cr_origen.clues.clues+") "+dato_desde;
          dato_hacia = element.cr_destino.descripcion_actualizada+" ("+element.cr_destino.clues.clues+") "+dato_hacia;
          
          let nombre_responsable = "";
          let nombre_responsable_copia = "";
          if(element.cr_destino.dependencia.clues == "CSSSA017213")
          {
            let responsable = element.cr_destino.directorio_responsable.responsable;
            nombre_responsable = "C. "+responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+", "+element.cr_destino.directorio_responsable.cargo;
            nombre_responsable_copia = responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+" - "+element.cr_destino.directorio_responsable.cargo;
          
          }else{
            let responsable = element.cr_destino.dependencia.directorio_responsable.responsable;
            nombre_responsable = "DR(A). "+responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+", "+element.cr_destino.dependencia.directorio_responsable.cargo;
            nombre_responsable_copia = responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+" - "+element.cr_destino.dependencia.directorio_responsable.cargo;
          }  
          let jurisdiccion_origen = "";
          let jurisdiccion_destino = "";
          let datos_nominales = datos_trabajador.rel_datos_laborales_nomina;
          
          let ur = datos_trabajador.rel_datos_laborales_nomina.ur;
          let denominacion = "";
          if(ur == "416")
          {
            denominacion = "BASE";
          }else if(ur == "FO2" || ur == "FO3" || ur == "FOR" )
          {
            denominacion = "FORMALIZADO";
          }else if(ur == "HOM" )
          {
            denominacion = "HOMOLOGADO";
          }else if(ur == "REG" )
          {
            denominacion = "REGULARIZADO";
          }

          if(ur == "CON_CAR" || ur == "CON_INS" || ur == "CON_OFI" || ur == "CON_UNI" || ur == "EST_CH" || ur == "EST_MMI" || ur == "EST_PAC" || ur == "X00" || ur == "HON")
          {
            contenido = "\n\nPor necesidades del servicio, tengo a bien comunicarle que a partir del "+this.convertirLetraCapital(this.convertirFechaTexto(element.fecha_cambio).toLowerCase())+
                        ", cambiará de adscripción de "+dato_desde+jurisdiccion_origen+" a "+dato_hacia+jurisdiccion_destino+
                        ", "+jurisdiccion_igual+" con código funcional: "+datos_nominales.codigo_puesto_id+" "+this.convertirLetraCapital(datos_nominales.codigo.descripcion)+
                        " debiéndose presentar con el "+nombre_responsable+", quien "+
                        "le indicará su jornada laboral y funciones a desempeñar. (Contrato) \n\n"+
                        "Asimismo se le informa que se le radicarán sus sueldos a la nueva unidad de adscripción. \n\n Sin otro particular, le envío un cordial saludo.";
          }else{
            contenido = "\n\nPor necesidades del servicio y con fundamento en el artículo 179 fracción VI de las Condiciones Generales de Trabajo, "+
                        "me permito comunicarle que a partir del "+this.convertirLetraCapital(this.convertirFechaTexto(element.fecha_cambio).toLowerCase())+
                        ", cambiará de adscripción de "+dato_desde+jurisdiccion_origen+" a "+dato_hacia+jurisdiccion_destino+
                        ", "+jurisdiccion_igual+" con plaza clave de "+denominacion+": "+datos_nominales.clave_presupuestal+", con código funcional: "+datos_nominales.codigo_puesto_id+" "+
                        this.convertirLetraCapital(datos_nominales.codigo.descripcion)+" debiéndose presentar con el "+nombre_responsable+", quien "+
                        "le indicará su jornada laboral y funciones a desempeñar.  \n\n"+
                        "Asimismo se le informa que se le radicarán sus sueldos a la nueva unidad de adscripción. \n\n Sin otro particular, le envío un cordial saludo.";
          }
          
          let copias = "C.C.P. "+nombre_secretario+" - "+nombres.secretario.cargo.toUpperCase()+"\n"+"C..C.P. "+nombre_responsable_copia+"\n";

          let informacion_oficio = {
            layout: 'noBorders',
            pageBreak:'',
            table: {
              widths: [400,'*'],
              margin: [0,0,0,0],
              body: [
                [
                  { text: "\n\nSECRETARÍA DE SALUD\n INSTITUTO DE SALUD\n DIRECCIÓN DE ADMINISTRACIÓN Y FINANZAS\n SUBDIRECCIÓN DE RECURSOS HUMANOS\n DEPTO. DE RELACIONES LABORALES", style: "texto_depto", colSpan:2},{},
                ],
                [
                  { text: "\nOFICIO: IS/DAF/SRH/DRL/5003/________________/"+(new Date()).getFullYear()+"\n\nASUNTO:CAMBIO DE ADSCRIPCIÓN\n\n TUXTLA GUTIÉRREZ, CHIAPAS; A "+fecha_hoy.toUpperCase(), style: "texto_num_oficio", colSpan:2},{},
                ],
                [
                  //{ text: "\nC.FERMIN SERVANDO MARTINEZ MARTINEZ\n M01006 MEDICO GENERAL 'A' (CSSSA004764)\n CENTRO DE SALUD RURAL 1 NÚCLEO BÁSICO ROBERTO BARRIOS", style: "texto_depto"},
                  { text: "\n\nC. "+datos_trabajador.nombre+" "+datos_trabajador.apellido_paterno+" "+datos_trabajador.apellido_materno+"\n"+
                  datos_trabajador.rel_datos_laborales_nomina.codigo_puesto_id+" "+datos_trabajador.rel_datos_laborales_nomina.codigo.descripcion+"\n"+
                  "("+datos_trabajador.rel_datos_laborales_nomina.cr.clues+") "+datos_trabajador.rel_datos_laborales_nomina.cr.descripcion_actualizada, style: "texto_depto", colSpan:2},{},
                ],
                [
                  { text: contenido.toUpperCase(), style: "texto_leyenda", colSpan:2},{},
                ],
                [
                  { text: "\n\n\n", style: "texto_num_oficio", colSpan:2},{},
                ],
                [
                  { text: "A T E N T A M E N T E\n\n\n\n\n"+"L.A. "+nombre_director+"\n"+nombres.direccion_admon.cargo+"\n\n", style: "texto_depto"},
                  {qr: "Documeto Validado por la El departamento de Relaciones Laborales", fit: "120"},
                ],
                [
                  { text: copias+
                          "Cc.p. "+nombre_control+". - "+nombres.control.cargo+"\n"+
                          "C.c.p. "+nombre_sistematizacion+". - "+nombres.sistematizacion.cargo+"\n\n"+
                          "Vo.Bo. "+nombre_subdireccion_rh+". - "+nombres.subdireccion_rh.cargo+"\n"+
                          "REVISÓ: "+nombre_relaciones_laborales+". - "+nombres.relaciones_laborales.cargo+"\n"+
                          nombre_elaboracion+".", style: "texto_firmas", colSpan:2},{},
                ],
              ]
            }
          };
          
          if(iteracciones != data.length)
          {
            informacion_oficio.pageBreak = 'after';
          }
          datos.content.push(informacion_oficio);
          iteracciones++;
        });

        
        return datos;
      }

      buscarJurisdiccional(jurisdiccion, Jurisdiccionales:any)
      {
        let datos:any;
        if(jurisdiccion == 11)
        {
          jurisdiccion = 1;
        }
        Jurisdiccionales.forEach(element => {

          if(jurisdiccion == element.cve_jurisdiccion)
          {
            datos = element;
          }
        });
        return datos;
      }

      convertirLetraCapital(string)
      {
        return string.toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
      }
      
      convertirFechaTexto(fecha)
      {
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
        var arrayFecha = fecha.split("-");
        let stringFecha:string = "";
        stringFecha = arrayFecha[2]+" DE "+meses[arrayFecha[1]-1]+" DEL "+arrayFecha[0];
        return stringFecha;
      }

      convertirJurisdiccion(jurisdiccion)
      {
          let juris = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'I'];
          return juris[jurisdiccion - 1];
      }

      convertirJurisdiccionLetra(jurisdiccion)
      {
          let juris = ['TUXTLA GUTIÉRREZ', 'SAN CRISTOBAL DE LAS CASAS', 'COMITAN DE DOMÍNGUEZ', 'VILLAFLORES', 'PICHUCALCO', 'PALENQUE', 'TAPACHULA', 'TONALA', 'OCOSINGO', 'MOTOZINTLA', 'TUXTLA GUTIÉRREZ'];
          return juris[jurisdiccion - 1];
      }
}