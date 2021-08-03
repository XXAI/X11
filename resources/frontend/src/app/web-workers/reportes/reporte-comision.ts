import { LOGOS } from "../../logos";


export class ReporteComision {

    getDocumentDefinition(reportData:any) {
        //console.log("ONDE",reportData);
        
        //console.log(reportData);
        //return;
        let comision = reportData.data;
        let datos_trabajador = reportData.data.trabajador;

        let Origenfirmate = reportData.firmanteOrigen;
        let DestinoFirmante = reportData.firmanteDestino;
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
                    text: '\n"2021, Año de la Independencia"',

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
                    text:fecha_hoy.toString(),
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
                fontSize: 9
              },

            }
        };

        // datos.content.push({
        //   layout: 'noBorders',
        //   table: {
        //     widths: ['*'],
        //     margin: [0,0,0,0],
        //     body: [
        //       [
        //         //{ text: "", colSpan:2},{},
        //         { text: "\n\n2021, Año de la Independencia", style: "texto_independencia"},
        //         //{ text: "", colSpan:4},{},{},{},
        //       ],
        //     ]
        //   }
        // });


        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                //{ text: "", colSpan:2},{},
                { text: "\n\nSECRETARÍA DE SALUD\n INSTITUTO DE SALUD\n DIRECCIÓN DE ADMINISTRACIÓN Y FINANZAS\n SUBDIRECCIÓN DE RECURSOS HUMANOS\n DEPTO. DE RELACIONES LABORALES", style: "texto_depto"},
                //{ text: "", colSpan:4},{},{},{},
              ],
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                //{ text: "", colSpan:2},{},
                { text: "\nOFICIO: IS/DAF/SRH/DRL/5003/________________/2021\n\nASUNTO:COMISIÓN\n\n TUXTLA GUTIÉRREZ, CHIAPAS; A "+fecha_hoy.toUpperCase(), style: "texto_num_oficio"},
                //{ text: "", colSpan:4},{},{},{},
              ],
            ]
          }
        });


        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                //{ text: "\nC.FERMIN SERVANDO MARTINEZ MARTINEZ\n M01006 MEDICO GENERAL 'A' (CSSSA004764)\n CENTRO DE SALUD RURAL 1 NÚCLEO BÁSICO ROBERTO BARRIOS", style: "texto_depto"},
                { text: "\n\nC. "+datos_trabajador.nombre+" "+datos_trabajador.apellido_paterno+" "+datos_trabajador.apellido_materno+"\n"+
                datos_trabajador.datoslaboralesnomina.codigo_puesto_id+" "+datos_trabajador.datoslaboralesnomina.codigo.descripcion+"\n"+
                "("+datos_trabajador.datoslaboralesnomina.cr.clues+") "+datos_trabajador.datoslaboralesnomina.cr.descripcion, style: "texto_depto"},
              ],
            ]
          }
        });


        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                //{ text: "", colSpan:2},{},
                { text: "\n\n\n\nPOR NECESIDADES DEL SERVICIO, ME PERMITO COMUNICARLE QUE, A PARTIR DEL "+this.convertirFechaTexto(comision.fecha_inicio)+","+" SE LE COMISIONA TEMPORALMENTE DEL "+
                datos_trabajador.datoslaboralesnomina.cr.descripcion+" ("+datos_trabajador.datoslaboralesnomina.cr.clues+"); DEPENDIENTE DE LA "+ 
                "JURISDICCIÓN SANITARIA No. "+this.convertirJurisdiccion(datos_trabajador.datoslaboralesnomina.clues.cve_jurisdiccion)+", AL "+
                datos_trabajador.datoslaborales.cr_fisico.descripcion+" ("+datos_trabajador.datoslaborales.cr_fisico.clues+") "+
                " CON CÓDIGO FUNCIONAL "+datos_trabajador.datoslaboralesnomina.codigo_puesto_id+" "+datos_trabajador.datoslaboralesnomina.codigo.descripcion+", "+
                "DEBIÉNDOSE PRESENTAR CON EL "+datos_trabajador.datoslaborales.cr_fisico.nombre_responsable+", "+
                "QUIEN LE INDICA SUS FUNCIONES Y JORNADAS LABORALES A DESARROLLAR. \n\n"+
                "ASIMISMO SE LE INFORMA QUE AL TERMINO DE LA PRESENTE COMISIÓN, DEBERÁ REINCORPORARSE A LA UNIDAD DE SU ADSCRIPCIÓN, COMO LO ESTABLECE LAS CONDICIONES GENERALES DE TRABAJO "+
                " EN SU ARTÍCULO 151."+"\n\n"+"CABE HACER MENCIÓN, QUE LA CONTINUIDAD DE LA PRÓRROGA DE COMISIÓN, NO LE DA DERECHO DE ANTIGÜEDAD, PARA CAMBIO DE ADSCRIPCIÓN, DONDE ACTUALMENTE SE ENCUENTRA COMISIONADO.\n\n"+
                "SIN OTRO PARTICULAR, LE ENVIÓ UN CORDIAL SALUDO.", style: "texto_leyenda"},
                //{ text: "\n\nPOR NECESIDADES DEL SERVICIO, ME PERMITO COMUNICARLE QUE A PARTIR DEL "+fecha_hoy.toUpperCase()+" DEL AÑO EN CURSO,\n"+" SE LE COMISIONA TEMPORALMENTE DEL "+" Centro de salud rural 1 nucleo basico roberto barrios (CSSSA004764);\n DEPENDIENTE DE LA "+ "JURISDICCION SANITARIA No. VI,"+"AL "+"Hospital General Palenque (CSSSA004595);\n"+" CON CÓDIGO FUNCIONAL M01006 MÉDICO GENERAL 'A', "+"DEBIENDOSE PRESENTAR CON EL "+"Dr. Jean Michel Gamez López,\n"+"QUIEN LE INDICA SUS FUNCIONES Y JORNADAS LABORALES A DESARROLLAR. (CONTRATO)\n\n"+"ASIMISMO SE LE INFORMA QUE AL TERMINO DE LA PRESENTE COMISIÓN, DEBERÁ REINCORPORARSE A LA UNIADAD DE SU\n ADSCRIPCIÓN, COMO LO ESTABLECE LAS CONDICIONES GENERALES DE TRABAJO EN SU ARTÍCULO 151."+"\n\n"+"CABE HACER MENCIÓN, QUE LA CONTINUIDAD DE LA PRORROGA DE COMISIÓN, NO LE DA DERECHO DE ANTIGÜEDAD, PARA CAMBIO DE ADSCRIPCIÓN, DONDE ACTUALMENTE SE ENCUENTRA COMISIONADO.\n\n"+"SIN OTRO PARTICULAR, LE ENVIÓ UN CORDIAL SALUDO.", style: "texto_leyenda"},
                //{ text: "", colSpan:4},{},{},{},
              ],
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                //{ text: "", colSpan:2},{},
                { text: "\n\n\n", style: "texto_num_oficio"},
                //{ text: "", colSpan:4},{},{},{},
              ],
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                //{ text: "", colSpan:2},{},
                { text: "A T E N T A M E N T E\n\n\n\n\n"+"L.A. SAMUEL SILVA OLÁN\n"+"DIRECTOR DE ADMINISTRACIÓN Y FINANZAS\n\n", style: "texto_depto"},
                //{ text: "", colSpan:4},{},{},{},
              ],
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                //{ text: "", colSpan:2},{},
                { text: "C.C.P. "+Origenfirmate.nombre_responsable+" - "+Origenfirmate.cargo_responsable+"\n"+
                        "C..C.P. "+DestinoFirmante.nombre_responsable+" - "+DestinoFirmante.cargo_responsable+"\n"+
                        "Cc.p. LIC. JULIO ALBERTO BEZARES DOMÍNGUEZ. JEFE DEL DEPARTAMENTO DE CONTROL DEL PAGO\n"+
                        "C.c.p. ING. GABRIEL DE LA GUARDIA NAGANO.- JEFE DEL DEPARTAMENTO DE OPERACIÓN Y SISTEMATIZACIÓN\n\n"+
                        "Vo.Bo. L.A.E. ANITA DEL CARMEN GARCÍA LEÓN - SUBDIRECTORA DE RECURSOS HUMANOS\n"+
                        "REVISÓ: LIC. ALINE ALEJANDRA FONZ MURILLO - JEFE DEL DEPTO. DE RELACIONES LABORALES", style: "texto_firmas"},
                //{ text: "", colSpan:4},{},{},{},
              ],
            ]
          }
        });

        
        return datos;
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
          let juris = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
          return juris[jurisdiccion - 1];
      }
}