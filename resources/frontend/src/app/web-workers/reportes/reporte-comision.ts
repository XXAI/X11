import { exit } from "process";
import { LOGOS } from "../../logos";


export class ReporteComision {

    getDocumentDefinition(reportData:any) {

        let comision = reportData.data.rel_trabajador_tramite;
        let datos_trabajador = reportData.data;
        console.log(datos_trabajador);
        console.log("1");
        console.log("_____________________________________________");
        let Origenfirmate = reportData.firmanteOrigen;
        let DestinoFirmante = reportData.firmanteDestino;
        let nombres = reportData.nombres;
        
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
        
        console.log(elaboracion);
        console.log("2");
        console.log("_____________________________________________");
        
        if(elaboracion != null)
        {
          nombre_elaboracion = "ELABORÓ: "+elaboracion.nombre+" "+elaboracion.apellido_paterno+" "+elaboracion.apellido_materno+" - ADMINISTRATIVO";
        }
        //let fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());
        let fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(2022,0,25));

        let mes_inicio = (parseInt(comision.fecha_inicio.substr(5,2)) - 1);
        let fecha_inicio =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(comision.fecha_inicio.substr(0,4), mes_inicio,comision.fecha_inicio.substr(8,2)));
        let mes_fin = (parseInt(comision.fecha_final.substr(5,2)) - 1);
        let fecha_fin =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(comision.fecha_final.substr(0,4), mes_fin,comision.fecha_final.substr(8,2)));

        console.log("fechas");
        console.log("3");
        console.log("_____________________________________________");
        
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
                fontSize: 9
              },

            }
        };

        let firmante_origen = "";
        let cargo_origen = "";
        let firmante_destino = "";
        let cargo_destino = "";
        /*if(Origenfirmate.responsable)
        {
          let obj_origen = Origenfirmate.responsable;
          firmante_origen = obj_origen.nombre+" "+obj_origen.apellido_paterno+" "+obj_origen.apellido_materno;
          cargo_origen = Origenfirmate.cargo;
        }

        if(DestinoFirmante.responsable)
        {
          let obj_destino = DestinoFirmante.responsable;
          firmante_destino = obj_destino.nombre+" "+obj_destino.apellido_paterno+" "+obj_destino.apellido_materno;
          cargo_destino = DestinoFirmante.cargo;
        }*/

        console.log("firmantes");
        console.log("4");
        console.log("_____________________________________________");

        /*datos.content.push({
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
                { text: "\nOFICIO: IS/DAF/SRH/DRL/5003/________________/"+(new Date()).getFullYear()+"\n\nASUNTO:COMISIÓN\n\n TUXTLA GUTIÉRREZ, CHIAPAS; A "+fecha_hoy.toUpperCase(), style: "texto_num_oficio"},
                //{ text: "\nOFICIO: IS/DAF/SRH/DRL/5003/________________/2021\n\nASUNTO:COMISIÓN\n\n TUXTLA GUTIÉRREZ, CHIAPAS; A 16 DE JUNIO DEL 2021", style: "texto_num_oficio"},
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
                "("+datos_trabajador.datoslaboralesnomina.cr.clues+") "+datos_trabajador.datoslaboralesnomina.cr.descripcion_actualizada, style: "texto_depto"},
              ],
            ]
          }
        });*/

        console.log("("+datos_trabajador.datoslaboralesnomina.cr.clues+") "+datos_trabajador.datoslaboralesnomina.cr.descripcion);
        console.log("5");
        console.log("_____________________________________________");

        let contenido = "";
        let ur = datos_trabajador.datoslaboralesnomina.ur;

        console.log(ur);
        console.log("6");
        console.log("_____________________________________________");
        let jurisdiccion = "";
        let dato_desde = "";
        
          let dato_hacia = "";
          let jurisdiccion_igual = "";
          let copia_dependencia = "";

        if(comision.cr_origen.cr_dependencia == comision.cr_destino.cr_dependencia)
        {
          if(comision.cr_origen.cr_dependencia != comision.cr_origen.cr && comision.cr_destino.cr_dependencia != comision.cr_destino.cr )
          {
            jurisdiccion_igual = " ambas dependientes de "+comision.cr_origen.dependencia.descripcion_actualizada+", ";
          }else{
            if(comision.cr_origen.cr_dependencia != comision.cr_origen.cr && comision.cr_destino.cr_dependencia != comision.cr_destino.cr)
            {
              dato_desde =" dependiente de "+ comision.cr_origen.dependencia.descripcion_actualizada;
            }
            if(comision.cr_destino.cr_dependencia != comision.cr_destino.cr){
              dato_hacia = " dependiente de la misma jurisdicción";
            }
          }
          
        }else{
          if(comision.cr_origen.cr_dependencia != comision.cr_origen.cr){
            dato_desde =" dependiente de "+ comision.cr_origen.dependencia.descripcion_actualizada;
          }
          if(comision.cr_destino.cr_dependencia != comision.cr_destino.cr){
            dato_hacia = " dependiente de "+comision.cr_destino.dependencia.descripcion_actualizada;
          }
          let datos_origen = comision.cr_origen.directorio_responsable;
          copia_dependencia = datos_origen.responsable.nombre+" "+datos_origen.responsable.apellido_paterno+" "+datos_origen.responsable.apellido_materno+" - "+datos_origen.cargo;
        }

        dato_desde = comision.cr_origen.descripcion_actualizada+" ("+comision.cr_origen.clues.clues+") "+dato_desde;
        dato_hacia = comision.cr_destino.descripcion_actualizada+" ("+comision.cr_destino.clues.clues+") "+dato_hacia;
        
        let nombre_responsable = "";
        let nombre_responsable_copia = "";
        if(comision.cr_destino.dependencia.clues == "CSSSA017213")
        {
          let responsable = comision.cr_destino.directorio_responsable.responsable;
          nombre_responsable = "C. "+responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+", "+comision.cr_destino.directorio_responsable.cargo;
          nombre_responsable_copia = responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+" - "+comision.cr_destino.directorio_responsable.cargo;
        
        }else{
          let responsable = comision.cr_destino.dependencia.directorio_responsable.responsable;
          nombre_responsable = "DR(A). "+responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+", "+comision.cr_destino.dependencia.directorio_responsable.cargo;
          nombre_responsable_copia = responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+" - "+comision.cr_destino.dependencia.directorio_responsable.cargo;
        }  
        
        //datos_trabajador = datos_trabajador.datoslaboralesnomina;

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
          contenido = "\n\n\n\nPOR NECESIDADES DEL SERVICIO, ME PERMITO COMUNICARLE QUE, A PARTIR DEL "+fecha_inicio.toUpperCase()+" AL "+fecha_fin.toUpperCase()+", SE LE COMISIONA TEMPORALMENTE DE "+
          dato_desde+" "+jurisdiccion+ " A "+
          dato_hacia+
          " CON CÓDIGO FUNCIONAL "+datos_trabajador.datoslaboralesnomina.codigo_puesto_id+" "+datos_trabajador.datoslaboralesnomina.codigo.descripcion+", "+
          "DEBIÉNDOSE PRESENTAR CON EL C. "+nombre_responsable+", "+
          "QUIEN LE INDICA SUS FUNCIONES Y JORNADAS LABORALES A DESARROLLAR. (CONTRATO) \n\n"+
          "ASIMISMO SE LE INFORMA QUE AL TERMINO DE LA PRESENTE COMISIÓN, DEBERÁ REINCORPORARSE A LA UNIDAD DE SU ADSCRIPCIÓN.  \n\n"+
          "CABE HACER MENCIÓN, QUE LA CONTINUIDAD DE LA PRÓRROGA DE COMISIÓN, NO LE DA DERECHO DE ANTIGÜEDAD, PARA CAMBIO DE ADSCRIPCIÓN.\n\n"+
          "SIN OTRO PARTICULAR, LE ENVIÓ UN CORDIAL SALUDO.";
        }else{
          
          /*contenido= "\n\n\n\nPOR NECESIDADES DEL SERVICIO Y CON FUNDAMENTO EN EL ARTÍCULO 149 DE LAS CONDICIONES GENERALES DE TRABAJO DE LA SECRETARIA DE SALUD, ME PERMITO COMUNICARLE QUE A PARTIR DEL "+fecha_inicio.toUpperCase()+" AL "+fecha_fin.toUpperCase()+", SE LE COMISIONA TEMPORALMENTE DE "+
          datos_trabajador.datoslaboralesnomina.cr.descripcion_actualizada+" ("+datos_trabajador.datoslaboralesnomina.cr.clues+"); DEPENDIENTE DE LA "+ 
          "JURISDICCIÓN SANITARIA No. "+this.convertirJurisdiccion(datos_trabajador.datoslaboralesnomina.clues.cve_jurisdiccion)+", A "+
          datos_trabajador.datoslaborales.cr_fisico.descripcion_actualizada+" ("+datos_trabajador.datoslaborales.cr_fisico.clues+"); CON PLAZA CLAVE BASÉ: "+datos_trabajador.datoslaboralesnomina.clave_presupuestal+
          " CON CÓDIGO FUNCIONAL "+datos_trabajador.datoslaboralesnomina.codigo_puesto_id+" "+datos_trabajador.datoslaboralesnomina.codigo.descripcion+", "+
          "DEBIÉNDOSE PRESENTAR CON EL C. "+firmante_destino+", "+
          "QUIEN LE INDICA SUS FUNCIONES Y JORNADAS LABORALES A DESARROLLAR. \n\n"+
          "ASIMISMO SE LE INFORMA QUE AL TERMINO DE LA PRESENTE COMISIÓN, DEBERÁ REINCORPORARSE A LA UNIDAD DE SU ADSCRIPCIÓN, COMO LO ESTABLECE LAS CONDICIONES GENERALES DE TRABAJO "+
          " EN SU ARTÍCULO 151."+"\n\n"+"CABE HACER MENCIÓN, QUE LA CONTINUIDAD DE LA PRÓRROGA DE COMISIÓN, NO LE DA DERECHO DE ANTIGÜEDAD, PARA CAMBIO DE ADSCRIPCIÓN, DONDE ACTUALMENTE SE ENCUENTRA COMISIONADO.\n\n"+
          "SIN OTRO PARTICULAR, LE ENVIÓ UN CORDIAL SALUDO.";*/

       console.log("7");
        console.log("_____________________________________________");
          contenido= "\n\n\n\nPOR NECESIDADES DEL SERVICIO Y CON FUNDAMENTO EN EL ARTÍCULO 149 DE LAS CONDICIONES GENERALES DE TRABAJO DE LA SECRETARIA DE SALUD, ME PERMITO COMUNICARLE QUE A PARTIR DEL "+fecha_inicio.toUpperCase()+" AL "+fecha_fin.toUpperCase()+", SE LE COMISIONA TEMPORALMENTE DE "+
          dato_desde+" "+jurisdiccion+ " A "+
          dato_hacia+"); CON PLAZA CLAVE "+denominacion+": "+datos_trabajador.datoslaboralesnomina.clave_presupuestal+
          " CON CÓDIGO FUNCIONAL "+datos_trabajador.datoslaboralesnomina.codigo_puesto_id+" "+datos_trabajador.datoslaboralesnomina.codigo.descripcion+", "+
          "DEBIÉNDOSE PRESENTAR CON EL C. "+nombre_responsable+", "+
          "QUIEN LE INDICA SUS FUNCIONES Y JORNADAS LABORALES A DESARROLLAR. \n\n"+
          "ASIMISMO SE LE INFORMA QUE AL TERMINO DE LA PRESENTE COMISIÓN, DEBERÁ REINCORPORARSE A LA UNIDAD DE SU ADSCRIPCIÓN, COMO LO ESTABLECE LAS CONDICIONES GENERALES DE TRABAJO "+
          " EN SU ARTÍCULO 151."+"\n\n"+"CABE HACER MENCIÓN, QUE LA CONTINUIDAD DE LA PRÓRROGA DE COMISIÓN, NO LE DA DERECHO DE ANTIGÜEDAD, PARA CAMBIO DE ADSCRIPCIÓN, DONDE ACTUALMENTE SE ENCUENTRA COMISIONADO.\n\n"+
          "SIN OTRO PARTICULAR, LE ENVIÓ UN CORDIAL SALUDO.";
        }

        console.log(contenido);
        console.log("7");
        console.log("_____________________________________________");



          let acuse_qr = "ACUSE DE AUTENTICACIÓN \n\n"+
          "Con el propósito de garantizar la validez de los documentos emitidos por el Departamento de Relaciones Laborales, dependiente de la Subdirección de Recursos Humanos,"+
          " de la Dirección de Administración y Finanzas del Instituto de Salud del Estado de Chiapas, y con fundamento en lo dispuesto en los artículos 37 y 65 del Reglamento "+
          "Interior, así como en el Manual de Organización del Instituto de Salud, se emite el presente Acuse de Autenticación que avala que los datos contenidos en este oficio "+
          "a nombre del(a) C. "+datos_trabajador.nombre+" "+datos_trabajador.apellido_paterno+" "+datos_trabajador.apellido_materno+", CURP(o RFC):"+datos_trabajador.rfc+", "+
          "con Código Funcional: "+datos_trabajador.datoslaboralesnomina.codigo_puesto_id+" "+datos_trabajador.datoslaboralesnomina.codigo.descripcion+" y Clave Presupuestal "+datos_trabajador.datoslaboralesnomina.clave_presupuestal+", "+
          "fueron verificados en la página SISTEMA DE RECURSOS HUMANO (SIRH) con fecha "+fecha_hoy+", manifestandose en la presente que todos los datos son autenticos y que en la Subdirección de Recursos Humanos"+
          " se cuenta físicamente con el documento debidamente integrado en el expediente único de personal correspondiente al/la trabajador(a) antes mencionado(a). \n\n"+
          "Para lo anterior, se da veracidad a la consulta hecha para la autentificación de este oficio, mediante la firma electrónica del funcionario en turno. "+
          "Se emite el presente en la Ciudad de Tuxtla Gutiérrez, Chiapas, con fecha "+fecha_hoy+", para los efectos legales y administrativos a que haya lugar."

          console.log(acuse_qr);
        console.log("8");
        console.log("_____________________________________________");
          let copias = "C.C.P. "+nombre_secretario+" - "+nombres.secretario.cargo.toUpperCase()+"\n"+"C..C.P. "+nombre_responsable_copia+"\n";

          if(copia_dependencia != "")
          {
            copias += copia_dependencia+"\n";
          }
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
                  { text: "\nOFICIO: IS/DAF/SRH/DRL/5003/________________/"+(new Date()).getFullYear()+"\n\nASUNTO:COMISIÓN\n\n TUXTLA GUTIÉRREZ, CHIAPAS; A "+fecha_hoy.toUpperCase(), style: "texto_num_oficio", colSpan:2},{},
                ],
                [
                  { text: "\n\nC. "+datos_trabajador.nombre+" "+datos_trabajador.apellido_paterno+" "+datos_trabajador.apellido_materno+"\n"+
                datos_trabajador.datoslaboralesnomina.codigo_puesto_id+" "+datos_trabajador.datoslaboralesnomina.codigo.descripcion+"\n"+
                "("+datos_trabajador.datoslaboralesnomina.cr.clues+") "+datos_trabajador.datoslaboralesnomina.cr.descripcion_actualizada, style: "texto_depto", colSpan:2},{},
                ],
                [
                  { text: contenido.toUpperCase(), style: "texto_leyenda", colSpan:2},{},
                ],
                [
                  { text: "\n\n\n", style: "texto_num_oficio", colSpan:2},{},
                ],
                [
                  { text: "A T E N T A M E N T E\n\n\n\n\n"+"L.A. "+nombre_director+"\n"+nombres.direccion_admon.cargo+"\n\n", style: "texto_depto"},
                  {qr: acuse_qr, fit: "210"},
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

        datos.content.push(informacion_oficio);
        console.log(datos);
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