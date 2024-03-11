import { LOGOS_OPD } from "../../logos_opd";

export class OpdFormatoAnexo{
    getDocumentDefinition(reportData:any) {
        let config = reportData.config;
        
        let registro = reportData.items;
        //Configuracion del archivo
        let datos = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
          pageMargins: [ 40, 90, 40, 60 ],
          header: {
            margin: [40, 20, 40, 0],
            table: {
              widths: ['*', '*',200],
              body: [
                  [
                      { 
                        image: LOGOS_OPD[4].LOGO_5, width: 160,alignment: 'center'     
                       },{
                        image: LOGOS_OPD[5].LOGO_6, width: 110, alignment: 'left'
                       },{
                        text:"BASES PARA LA RECEPCIÓN DE BIENES MUEBLES E INMUEBLES QUE TRANSFIERAN A FAVOR DE LOS SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL BIENESTAR (IMSS-BIENESTAR)", style:'letra_cabecera',alignment: 'justify'
                       }
                  ],
              ]
          },
          layout: 'noBorders'
        },
          footer: function (currentPage, pageCount) {
            let text_footer = "";
            text_footer = "1 Conforme al artículo 3, fracción X de la Bases señaladas, las partes involucradas suscribirán documento mediante el cual los trabajadores se responsabilizan respecto de los bienes que conformen el patrimonio del IMSS-BIENESTAR y quedan bajo su cuidado.";
            return {
                margin: [30, 20, 30, 0],
                table: {
                    widths: ['*', '*', 100],
                    body: [
                        [
                            { 
                              //text:'Las firmas que anteceden forman parte del ANEXO 2 denominado MODELO DEL ACTA DE ENTREGA RECEPCIÓN DE BIENES INMUEBLES celebrado entre el Gobierno del Estado de Chiapas y el Organismo Público Descentralizado Denominado Servicios De Salud del Instituto Mexicano del Seguro Social para el Bienestar, el 15 de marzo del 2024.',
                              text: text_footer,
                              alignment:'justify',
                              fontSize: 7,
                              colSpan:2       
                             },{},
                            { 
                              text: "Página " + currentPage.toString() + ' de '+pageCount.toString(),
                              alignment:'right',
                              fontSize: 7,
                             }
                        ],
                    ]
                },
                layout: 'noBorders'
            };
        },
          content: [],
            styles: {
              letra_cabecera:
              {
                fontSize:9
              },
              superIndice:
              {
                verticalAlign:'super', 
                fontSize:7
              },
              texto_justificado:
              {
                fontSize: 11,
                alignment:"justify",
                //bold:true,
                color: "#424142"
              },
              texto_justificado_bold:
              {
                fontSize: 11,
                alignment:"justify",
                bold:true,
                color: "#424142"
              },
              texto_justificado_cuadro:
              {
                fontSize: 11,
                alignment:"justify",
                border: "1px solid",
                color: "#424142"
              },
              texto_centrado:
              {
                fontSize: 11,
                alignment:"center",
                //bold:true,
                color: "#424142"
              },
              texto_centrado_bold:
              {
                fontSize: 11,
                alignment:"center",
                bold:true,
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

        //Anexo 3
        let c_3_1_1 = "MODELO DE RESGUARDO";
        let number_sup = "1";
        let c_3_2_1 = "En ";
        let c_3_2_2 = registro.municipio+" ";
        let c_3_2_3 = "siendo las ";
        let c_3_2_4 = "12:00hrs ";
        let c_3_2_5 = "horas del día ";
        let c_3_2_6 = "15 del mes de marzo del año dos mil veinticuatro";
        let c_3_2_7 = ", el C. ";
        let c_3_2_8 = registro.responsable;
        let c_3_2_9 = " responsable de la UNIDAD DE SALUD DENOMINADA ";
        let c_3_2_10 = registro.nombre_unidad+" ";
        let c_3_2_11 = ", CLUES ";
        let c_3_2_12 = registro.clues;
        let c_3_2_13 = " de ";
        let c_3_2_14 = '"EL IMSS-BIENESTAR" ';
        let c_3_2_15 = "hace constar que recibe en resguardo los bienes objeto de las actas de entrega que a continuación se detallan:\n\n";
        let c_3_3_1 = '1. Lo especificado de conformidad al anexo I denominado "modelo de acta entrega recepción de bienes inmuebles" elaborado por el C,';
        let c_3_3_2 = registro.responsable;
        let c_3_3_3 = " derivado del ";
        let c_3_3_4 = "CONVENIO ESPECÍFICO DE COORDINACIÓN PARA LA TRANSFERENCIA DE LOS BIENES INMUEBLES RELACIONADOS CON LOS ESTABLECIMIENTOS DE SALUD A QUE "+
        "SE REFIERE LA CLÁUSULA SEGUNDA Y ANEXO 1 DEL CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE COLABORACIÓN EN MATERIA DE "+
        "PERSONAL, INFRAESTRUCTURA, EQUIPAMIENTO, MEDICAMENTOS Y DEMÁS INSUMOS ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE SERVICIOS DE "+
        "SALUD, PARA LAS PERSONAS SIN SEGURIDAD SOCIAL CELEBRADO ENTRE LA SECRETARÍA DE SALUD (SSA); EL INSTITUTO MEXICANO DEL SEGURO "+
        "SOCIAL (IMSS); SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL BIENESTAR (IMSS-BIENESTAR) Y EL GOBIERNO DE "+
        "LA ENTIDAD FEDERATIVA CHIAPAS, DE FECHA 22 DE JUNIO DE 2023 Y SU MODIFICATORIO DE FECHA 18 DE ENERO DE 2024, QUE "+
        "CELEBRAN POR UNA PARTE, SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL BIENESTAR, AL QUE EN LO SUCESIVO SE LE DENOMINARÁ "+
        '"IMSS-BIENESTAR", REPRESENTADO POR EL DR. ALEJANDRO ANTONIO CALDERÓN ALIPI, EN SU CARÁCTER DE DIRECTOR GENERAL, ASISTIDO POR EL DR. VÍCTOR HUGO BORJA ABURTO, '+
        "TITULAR DE LA UNIDAD DE ATENCIÓN A LA SALUD, EL ARQ. CARLOS SÁNCHEZ MENESES, TITULAR DE LA UNIDAD DE INFRAESTRUCTURA Y POR EL LIC. AUNARD AGUSTÍN DE LA ROCHA WAITE, "+
        "TITULAR DE LA UNIDAD DE ADMINISTRACIÓN Y FINANZAS, ADEMÁS DE FUNGIR EN SU CARÁCTER DE RESPONSABLE INMOBILIARIO, Y POR LA OTRA PARTE, EL EJECUTIVO DE LA ENTIDAD "+
        'FEDERATIVA CHIAPAS, AL QUE EN LO SUCESIVO SE LE DENOMINARÁ "EL GOBIERNO DE LA ENTIDAD", REPRESENTADO POR EL DR. FRANCISCO ARTURO MARISCAL OCHOA, ENCARGADO DEL '+
        "DESPACHO DE LA SECRETARIA DE SALUD Y DE LA DIRECCIÓN GENERAL DEL INSTITUTO DE SALUD, LIC. MARIA ESTHER GARCÍA RUÍZ, SECRETARIA DE HACIENDA Y DR. CORAZÓN DE JESUS "+
        "PÉREZ MEDINA, ENCARGADO DE LA DIRECCIÓN GENERAL DEL INSTITUTO DEL PATRIMONIO DEL ESTADO de fecha 15 de marzo del 2024 celebrado en la Ciudad de Tuxtla Gutiérrez, Chiapas.\n\n\n";
        
        let c_3_4_1 = '2. Lo especificado de conformidad al anexo II denominado "modelo de acta entrega recepción de bienes muebles", lo anterior con sus respectivos anexos '+
                      "emanados del sistema SINERHIAS y del sistema de patrimonio, elaborado por el C. ";
        let c_3_4_2 = registro.responsable;
        let c_3_4_3 = ", derivado del ";
        let c_3_4_4 = "CONVENIO ESPECÍFICO DE COORDINACIÓN PARA LA TRANSFERENCIA DE LOS BIENES INMUEBLES RELACIONADOS CON LOS ESTABLECIMIENTOS DE SALUD A QUE SE REFIERE "+
                      "LA CLÁUSULA SEGUNDA Y ANEXO 1 DEL CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE COLABORACIÓN EN MATERIA DE PERSONAL, INFRAESTRUCTURA, "+
                      "EQUIPAMIENTO, MEDICAMENTOS Y DEMÁS INSUMOS ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE SERVICIOS DE SALUD, PARA LAS PERSONAS SIN SEGURIDAD SOCIAL "+
                      "CELEBRADO ENTRE LA SECRETARÍA DE SALUD (SSA); EL INSTITUTO MEXICANO DEL SEGURO SOCIAL (IMSS); SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO "+
                      "SOCIAL PARA EL BIENESTAR (IMSS-BIENESTAR) Y EL GOBIERNO DE LA ENTIDAD FEDERATIVA CHIAPAS, DE FECHA 22 DE JUNIO DE 2023 Y SU MODIFICATORIO DE FECHA 18 "+
                      "DE ENERO DE 2024, QUE CELEBRAN POR UNA PARTE, SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL BIENESTAR, AL QUE EN LO SUCESIVO SE "+
                      'LE DENOMINARÁ "IMSS-BIENESTAR", REPRESENTADO POR EL DR. ALEJANDRO ANTONIO CALDERÓN ALIPI, EN SU CARÁCTER DE DIRECTOR GENERAL, ASISTIDO POR '+
                      "EL DR. VÍCTOR HUGO BORJA ABURTO, TITULAR DE LA UNIDAD DE ATENCIÓN A LA SALUD, EL ARQ. CARLOS SÁNCHEZ MENESES, TITULAR DE LA UNIDAD DE INFRAESTRUCTURA "+
                      "Y POR EL LIC. AUNARD AGUSTÍN DE LA ROCHA WAITE, TITULAR DE LA UNIDAD DE ADMINISTRACIÓN Y FINANZAS, ADEMÁS DE FUNGIR EN SU CARÁCTER DE RESPONSABLE INMOBILIARIO, Y POR LA OTRA PARTE, EL EJECUTIVO "+
                      'DE LA ENTIDAD FEDERATIVA CHIAPAS, AL QUE EN LO SUCESIVO SE LE DENOMINARÁ "EL GOBIERNO DE LA ENTIDAD", REPRESENTADO POR EL DR. FRANCISCO ARTURO MARISCAL OCHOA, ENCARGADO '+
                      "DEL DESPACHO DE LA SECRETARIA DE SALUD Y DE LA DIRECCIÓN GENERAL DEL INSTITUTO DE SALUD, LIC. MARIA ESTHER GARCÍA RUÍZ, SECRETARIA DE HACIENDA Y DR. CORAZÓN DE JESUS "+
                      "PÉREZ MEDINA, ENCARGADO DE LA DIRECCIÓN GENERAL DEL INSTITUTO DEL PATRIMONIO DEL ESTADO de fecha 15 de marzo del 2024 celebrado en la Ciudad de Tuxtla Gutiérrez, Chiapas.\n\n";
        
        let c_3_5 = "3. Y lo demás inherente como: Mobiliario, Equipo electro médico, equipo de cómputo, paquetería y Software, relación de sistemas, programas y/o "+
        "software desarrollado internamente, Instrumental, Ropería, Instrumentos y recipientes de cocina, Equipo de transporte y/o maquinaria, Relación de obras "+
        "de arte y decoración, relación de libros, publicaciones, materiales bibliográficos e informativos existentes en la unidad, relación de manuales de organización, "+
        "políticas y normas de administración interna, Inventario de almacén, relación de formas oficiales (Certificados de nacimiento, defunción y muerte fetal), relación "+
        "de archivo en trámite, relación de respaldo de archivos y carpetas en discos duros, dispositivos magnéticos y/o electrónicos, relación de archivo histórico, sobre "+
        "cerrado con la combinación de cajas fuertes y/o contraseñas, relación de sellos oficiales, relación de equipo de video, relación de archivo de concentración, "+
        "plantilla de personal, relación de expedientes personales, personal con licencia, permiso o comisión, estructura organizacional, resumen de plazas autorizadas, "+
        "control de vacaciones del personal pendientes de disfrutar, relación de asuntos de gestión pendientes de respuesta, Inventario de medicamentos, Inventario de material de curación.\n\n";

        let c_3_6 = "Por lo anterior, se acepta y asume el compromiso de resguardar los bienes objeto de las actas detalladas con anterioridad, así como de dar aviso a la Unidad de "+
        "Administración y Finanzas del IMSS-BIENESTAR, de cualquier modificación, alteración o daño que pudieran sufrir dichos bienes, procediendo a la formalización del presente "+
        "resguardo, de conformidad con lo establecido en el artículo 3, fracción X de las BASES PARA LA RECEPCIÓN DE BIENES MUEBLES E INMUEBLES QUE TRANSFIERAN A FAVOR DE LOS "+
        "SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL BIENESTAR (IMSS-BIENESTAR), aprobadas por la Junta de Gobierno el día 01 de Marzo de 2024. "+
        "Se suscribe el presente por cuadruplicado y se manifiesta que es cierto lo que se asienta.\n\n";

        let c_3_7_1 = 'ENTREGA\n\n\n\nDr. Roberto  Sánchez Moscoso\n_______________________________\nNOMBRE';
        let c_3_7_2 = '\nCoordinador Estatal Chiapas del  "IMSS-BIENESTAR"';
        let c_3_8_1 = 'RECIBE EN REGUARDO\n\n\n\n'+registro.responsable+'\n_______________________________\nNOMBRE';
        let c_3_8_2 = '\nCARGO DEL "IMSS-BIENESTAR"\n(Responsable del establecimiento de Salud)';
        
        let c_3_9_1 = 'LA PRESENTE HOJA CORRESPONDE AL RESGUARDO DE LA UNIDAD DE SALUD DENOMINADA ';
        let c_3_9_2 = registro.nombre_unidad;
        let c_3_9_3 = ' CLUES ';
        let c_3_9_4 = registro.clues;
        let c_3_9_5 = ' SUSCRITA EL 15 DE MARZO DE DOS MIL VEINTICUATRO.';

        
        let informacion_bloque_6 = {
          layout: 'noBorders',
          pageBreak:'',
          //margin: [11,margen_tabla,0,0],
          //absolutePosition: {x: 49, y: margen_tabla},
          table: {
            widths: ['*', '*','*'],
            body: [
              [{ text: [
                {text:c_3_1_1},
                {text:number_sup, style:'superIndice'}
              ], style: "texto_centrado_bold", colSpan:3 }, {}, {} ],
              [{ text: [
                { text: c_3_2_1 },
                { text: c_3_2_2, style: "texto_justificado_bold",decoration: 'underline' },
                { text: c_3_2_3 },
                { text: c_3_2_4, style: "texto_justificado_bold" },
                { text: c_3_2_5 },
                { text: c_3_2_6, style: "texto_justificado_bold" },
                { text: c_3_2_7 },
                { text: c_3_2_8, style: "texto_justificado_bold",decoration: 'underline' },
                { text: c_3_2_9 },
                { text: c_3_2_10, style: "texto_justificado_bold",decoration: 'underline' },
                { text: c_3_2_11 },
                { text: c_3_2_12, style: "texto_justificado_bold",decoration: 'underline' },
                { text: c_3_2_13 },
                { text: c_3_2_14, style: "texto_justificado_bold" },
                { text: c_3_2_15 },
              ], style: "texto_justificado", colSpan:3 }, {}, {} ],
              [{ text: [
                {text: c_3_3_1},
                {text: c_3_3_2, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_3_3_3},
                {text: c_3_3_4, style: "texto_justificado_bold"},
              ], style: "texto_justificado", colSpan:3 }, {}, {} ],
              [{ text: [
                {text: c_3_4_1},
                {text: c_3_4_2, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_3_4_3},
                {text: c_3_4_4, style: "texto_justificado_bold"},
              ], style: "texto_justificado", colSpan:3 }, {}, {} ],
              [{ text: c_3_5, style: "texto_justificado", colSpan:3 }, {},{} ],
              [{ text: c_3_6, style: "texto_justificado", colSpan:3 }, {},{} ],
              
            ]
          }
        }
        let informacion_bloque_7 = {
          layout: 'noBorders',
          pageBreak:'',
          table: {
            widths: ['*', '*'],
            body: [
              [{ text: [
                {text: c_3_7_1, style: "texto_centrado_bold"},
                {text: c_3_7_2}
              ], style: "texto_centrado" }, 
              {text: 
                [
                  {text: c_3_8_1, style: "texto_centrado_bold"},
                  {text: c_3_8_2}
                ], style: "texto_centrado"} ],
              
            ]
          }
        }
        let informacion_bloque_8 = {
          pageBreak:'',
          margin: [0,20,0,0],
          table: {
            widths: ['*'],
            body: [
              [{ text: 
                [
                  {text: c_3_9_1},
                  {text: c_3_9_2, style: "texto_justificado_bold",decoration: 'underline'},
                  {text: c_3_9_3},
                  {text: c_3_9_4, style: "texto_justificado_bold",decoration: 'underline'},
                  {text: c_3_9_5},
                ], style: "texto_justificado_cuadro"} ],              
            ]
          }
        }
        //Fin anexo 3

        //Cabecera

        datos.content.push(informacion_bloque_6);
        datos.content.push(informacion_bloque_7);
        datos.content.push(informacion_bloque_8);
    
        
        
        return datos;
      }
}