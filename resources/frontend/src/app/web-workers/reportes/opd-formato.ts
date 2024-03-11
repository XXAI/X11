import { LOGOS_OPD } from "../../logos_opd";

export class OpdFormato{
    getDocumentDefinition(reportData:any) {
        let config = reportData.config;
        
        let registro = reportData.items;
        //Configuracion del archivo
        let datos = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            table: {
              widths: ['*', '*','*', '*'],
              body: [
                  [
                      { 
                        image: LOGOS_OPD[0].LOGO_1, width: 120,alignment: 'center'      
                       },{
                        image: LOGOS_OPD[1].LOGO_2, width: 120, alignment: 'center'
                       },{
                        image: LOGOS_OPD[2].LOGO_3, width: 70,alignment: 'center'
                       },
                      { 
                        image: LOGOS_OPD[3].LOGO_4, width: 70,alignment: 'center'
                       }
                  ],
              ]
          },
          layout: 'noBorders'
        },
          footer: function (currentPage, pageCount) {
            let text_footer = "";
            if(currentPage < 4)
            {
              text_footer = "Las firmas que anteceden forman parte del ANEXO 1 denominado MODELO DEL ACTA DE ENTREGA RECEPCIÓN DE BIENES MUEBLES celebrado entre el Gobierno del Estado de Chiapas y el Organismo Público Descentralizado Denominado Servicios De Salud del Instituto Mexicano del Seguro Social para el Bienestar, el 15 de marzo del 2024.";
            }else if(currentPage <7)
            {
              text_footer = "Las firmas que anteceden forman parte del ANEXO 2 denominado MODELO DEL ACTA DE ENTREGA RECEPCIÓN DE BIENES INMUEBLES celebrado entre el Gobierno del Estado de Chiapas y el Organismo Público Descentralizado Denominado Servicios De Salud del Instituto Mexicano del Seguro Social para el Bienestar, el 15 de marzo del 2024.";
            }else if(currentPage <9)
            {
              text_footer = "Conforme al artículo 3, fracción X de la Bases señaladas, las partes involucradas suscribirán documento mediante el cual los trabajadores se responsabilizan respecto de los bienes que conformen el patrimonio del IMSS-BIENESTAR y quedan bajo su cuidado.";
            }

            
            let pagina = 1;
            let pagina_total = 3;
            if(currentPage>3)
            {
              pagina = currentPage -3;
              //pagina_total = 3;
            }else{
              pagina = currentPage;
            }

            return {
                margin: [30, 20, 30, 0],
                table: {
                    widths: ['*', '*','*', 100],
                    body: [
                        [
                            { 
                              //text:'Las firmas que anteceden forman parte del ANEXO 2 denominado MODELO DEL ACTA DE ENTREGA RECEPCIÓN DE BIENES INMUEBLES celebrado entre el Gobierno del Estado de Chiapas y el Organismo Público Descentralizado Denominado Servicios De Salud del Instituto Mexicano del Seguro Social para el Bienestar, el 15 de marzo del 2024.',
                              text: text_footer,
                              alignment:'justify',
                              fontSize: 7,
                              colSpan:3       
                             },{},{},
                            { 
                              text: "Página " + pagina.toString() + ' de '+pagina_total.toString(),
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
              texto_subrayado:
              {
                
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

        let iteraccion = 1;
        let bandera = 0;
        let tamano_arreglo = data.length;

        //Primera Hoja
        let c_1_1 = "ANEXO 1";
        let c_1_2 = "MODELO DEL ACTA DE ENTREGA RECEPCIÓN DE BIENES MUEBLES\n\n";
        let c_1_3_1 = "ACTA QUE CELEBRAN, POR UNA PARTE EL SECRETARIO DE SALUD Y DIRECTOR GENERAL "+
        'DEL INSTITUTO DE SALUD EN EL ESTADO DE CHIAPAS, EN LO SUCESIVO "LA SSA" REPRESENTADA POR EL DR. FRANCISCO ARTURO MARISCAL OCHOA,  ENCARGADO DEL DESPACHO DE LA'+
        " SECRETARIA DE SALUD Y DE LA DIRECCIÓN GENERAL DEL INSTITUTO DE SALUD, EN SU CALIDAD DE OTORGANTE, ASISTIDO POR LA LIC. MARIA ESTHER GARCÍA RUÍZ, SECRETARIA DE"+
        " HACIENDA Y DR. CORAZÓN DE JESUS PÉREZ MEDINA, ENCARGADO DE LA DIRECCIÓN DEL INSTITUTO DEL PATRIMONIO EN EL ESTADO DE CHIAPAS Y POR OTRA, EN CALIDAD DE RECEPTOR EL"+
        ' ORGANISMO PÚBLICO DESCENTRALIZADO DENOMINADO SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL BIENESTAR,  EN LO SUCESIVO "EL IMSS-BIENESTAR", '+
        "REPRESENTADO EN ESTE ACTO POR EL COORDINADOR ESTATAL EN CHIAPAS, EL DR. ROBERTO SANCHEZ MOSCOSO ASISTIDOS POR LOS JEFES DE SERVICIOS DE ATENCIÓN A LA SALUD, JEFES DE"+
        " SERVICIOS JURÍDICOS Y EL JEFE DE DEPARTAMENTO ADMINISTRATIVO RESPECTIVAMENTE DE LA REFERIDA COORDINACIÓN, LOS CC. ROSALBA MORALES GARCIA, ERNESTO GUTIERREZ COELLO Y"+
        " MANUEL ANTONIO MORENO ALVAREZ, PARA HACER CONSTAR LA ENTREGA-RECEPCIÓN FÍSICA Y JURÍDICA DE LA UNIDAD DE SALUD DENOMINADA";
        let c_1_3_2 =registro.nombre_unidad;
        let c_1_3_3 = ", CLUES (";
        let c_1_3_4 = registro.clues;
        let c_1_3_5 ="), CON MOTIVO DEL CONVENIO ESPECÍFICO DE COORDINACIÓN PARA LA TRANSFERENCIA DE LOS BIENES INMUEBLES RELACIONADOS CON LOS ESTABLECIMIENTOS DE SALUD A QUE SE REFIERE LA "+
        "CLÁUSULA SEGUNDA Y ANEXO 1 DEL CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE COLABORACIÓN EN MATERIA DE PERSONAL, INFRAESTRUCTURA, EQUIPAMIENTO, MEDICAMENTOS Y "+
        "DEMÁS INSUMOS ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE SERVICIOS DE SALUD, PARA LAS PERSONAS SIN SEGURIDAD SOCIAL, CELEBRADO ENTRE “EL IMSS-BIENESTAR” Y GOBIERNO DEL "+
        "ESTADO DE CHIAPAS EL 15 DE MARZO DEL 2024.\n\n\n";

        let c_1_4_1 = 'En ';
        let c_1_4_2 = registro.localidad;
        let c_1_4_3 = ', siendo las 9:00 horas del día 15 de marzo del año dos mil veinticuatro, se reunieron los representantes de ';
        let c_1_4_4 = '"LA SSA" ';
        let c_1_4_5 = "y de ";
        let c_1_4_6 = '"EL IMSS-BIENESTAR"';
        let c_1_4_7 = " con la finalidad de llevar acabo el acto de entrega - recepción física y jurídica de los bienes muebles referidos en el ";
        let c_1_4_8 = "CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE "+
        "COLABORACIÓN EN MATERIA DE PERSONAL, INFRAESTRUCTURA, EQUIPAMIENTO, MEDICAMENTOS Y DEMÁS INSUMOS ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE SERVICIOS DE SALUD, PARA LAS "+
        "PERSONAS SIN SEGURIDAD SOCIAL";
        let c_1_4_9 = " celebrado entre ";
        let c_1_4_10 = '"EL IMSS-BIENESTAR" ';
        let c_1_4_11 = "y ";
        let c_1_4_12 = "GOBIERNO DEL ESTADO DE CHIAPAS";
        let c_1_4_13 = " el 22 de junio de 2023, los cuales serán transferidos para prestar "+
        "gratuitamente los servicios de salud, medicamentos y demás insumos asociados, a la población sin seguridad social en esa Entidad Federativa, con base al modelo de "+
        'atención que opera el ';
        let c_1_4_14 = '"IMSS-BIENESTAR."\n\n';
        let c_1_5 = "DE LA ENTREGA Y RECEPCIÓN\n\n";
        let c_1_6_1 = "PRIMERO.- ";
        let c_1_6_2 = "Con la presente acta se hace constar que ";
        let c_1_6_3 = '"LA SSA" ';
        let c_1_6_4 = "transfiere y entrega los bienes muebles de la unidad de salud denominada ";
        let c_1_6_5 = "("+registro.nombre_unidad+") ";
        let c_1_6_6 = registro.clues;
        let c_1_6_7 = ", ubicada en ";
        let c_1_6_8 = registro.vialidad;
        let c_1_6_9 = ", contenidos en el Anexo 1 que se adjunta a la presente acta.\n\n";
        let c_1_7_1 = "SEGUNDO.- ";
        let c_1_7_2 = '"EL IMSS-BIENESTAR"';
        let c_1_7_3 = ", recibe los bienes muebles contenidos en el ";
        let c_1_7_4 = "Anexo 1 ";
        let c_1_7_5 = "que se adjunta a la presente acta de conformidad con el ";
        let c_1_7_6 = "CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE COLABORACIÓN EN MATERIA DE PERSONAL, INFRAESTRUCTURA, EQUIPAMIENTO, MEDICAMENTOS Y DEMÁS INSUMOS ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE "+
        "SERVICIOS DE SALUD, PARA LAS PERSONAS SIN SEGURIDAD SOCIAL ";
        let c_1_7_7 = "celebrado entre ";
        let c_1_7_8 = '"EL IMSS-BIENESTAR" ';
        let c_1_7_9 = "y ";
        let c_1_7_10 = "GOBIERNO DEL ESTADO DE CHIAPAS ";
        let c_1_7_11 = "el 22  de junio de  dos mil veintitrés.\n\n";
        let c_1_7_12 = '"EL IMSS-BIENESTAR" ';
        let c_1_7_13 = "en un término de ";
        let c_1_7_14 = "120 ";
        let c_1_7_15 ="días naturales contados a partir de la fecha de firma de la presente acta, realizará la verificación de los bienes recibidos en "+
        "coordinación con las entidades federativas y podrá requerir las aclaraciones correspondientes, además formulará las observaciones que, en su caso, considere pertinentes "+
        "respecto de la documentación técnica.\n\n";
        let c_1_8_1 = 'TERCERO.- "LA SSA" ';
        let c_1_8_2 = "acredita la propiedad y/o posesión de los bienes muebles, mismos que se encuentran libres de adeudo y de procedimientos legales que pudieran afectar "+
        "su propiedad, contenidos en el ";
        let c_1_8_3 = "Anexo 1 ";
        let c_1_8_4 = "que se transfieren con el mismo anexo. Dichos bienes tienen valor por un monto de ";
        let c_1_8_5 = "$ NO DETERMINADO.\n\n";
        let c_1_9_1 = 'CUARTO.- "EL IMSS-BIENESTAR" ';
        let c_1_9_2 = "recibe de manera integral, en este acto los bienes muebles contenidos en el ";
        let c_1_9_3 = "Anexo 1 ";
        let c_1_9_4 = "que se adjunta a la presente acta, ello  con la "+
        "finalidad de brindar servicios de salud a la población sin seguridad social en términos de lo pactado en el ";
        let c_1_9_5 = "Convenio de Coordinación que establece la forma de "+
        "colaboración en materia de personal, infraestructura, equipamiento, medicamentos y demás insumos asociados para la prestación gratuita de servicios de salud, para las "+
        "personas sin seguridad social ";
        let c_1_9_6 = "y conforme a las disposiciones jurídicas aplicables.\n\n";
        let c_1_10 = "Procediendo a la formalización de la Acta Entrega-Recepción física y jurídica de los bienes muebles transferidos, de conformidad con lo establecido en el artículo "+
        "12 de las BASES PARA LA RECEPCIÓN DE BIENES MUEBLES E INMUEBLES QUE TRANSFIERAN A FAVOR DE LOS SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL "+
        "BIENESTAR (IMSS-BIENESTAR).\n\n";
        let c_1_11 = "CIERRE DEL ACTA\n\n";
        let c_1_12_1 = "Leída la presente acta y conformes con su contenido y alcance legal, los que en ella intervienen la suscriben por ";
        let c_1_12_2  = "cuadruplicado ";
        let c_1_12_3 ="y manifiestan que es cierto lo que en "+
        "ella se asienta. No teniendo más que agregar se da por concluida siendo las ";
        let c_1_12_4 = "12:00";
        let c_1_12_5 = " horas, del día ";
        let c_1_12_6 = "15 de marzo ";
        let c_1_12_7 = "de dos mil veinticuatro.";
        
        let informacion_bloque_1 = {
          layout: 'noBorders',
          pageBreak:'',
          //margin: [11,margen_tabla,0,0],
          //absolutePosition: {x: 49, y: margen_tabla},
          table: {
            widths: ['*', '*','*', '*'],
            body: [
              [{ text: c_1_1, style: "texto_centrado_bold", colSpan:4 }, {}, {}, {} ],
              [{ text: c_1_2, style: "texto_centrado_bold", colSpan:4 }, {}, {}, {} ],
              [{ text: [{text: c_1_3_1},{text: c_1_3_2,decoration: 'underline'},{text: c_1_3_3},{text: c_1_3_4,decoration: 'underline'},{text: c_1_3_5}], style: "texto_justificado_bold", colSpan:4 }, {}, {}, {} ],
              [{ text: [
                {text: c_1_4_1},
                {text: c_1_4_2,decoration: 'underline'},
                {text: c_1_4_3},
                {text: c_1_4_4, style: "texto_justificado_bold"},
                {text: c_1_4_5},
                {text: c_1_4_6, style: "texto_justificado_bold"},
                {text: c_1_4_7},
                {text: c_1_4_8, style: "texto_justificado_bold"},
                {text: c_1_4_9},
                {text: c_1_4_10, style: "texto_justificado_bold"},
                {text: c_1_4_11},
                {text: c_1_4_12, style: "texto_justificado_bold"},
                {text: c_1_4_13},
                {text: c_1_4_14, style: "texto_justificado_bold"},
              ], style: "texto_justificado", colSpan:4 }, {}, {}, {} ],
              [{ text: c_1_5, style: "texto_centrado_bold", colSpan:4 }, {}, {}, {} ],
              [{ text: [
                {text: c_1_6_1, style: "texto_justificado_bold"},
                {text: c_1_6_2},
                {text: c_1_6_3, style: "texto_justificado_bold"},
                {text: c_1_6_4},
                {text: c_1_6_5, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_1_6_6, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_1_6_7},
                {text: c_1_6_8, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_1_6_9},
              ], style: "texto_justificado", colSpan:4 }, {}, {}, {} ],
              [{ text: [
                {text: c_1_7_1, style: "texto_justificado_bold"},
                {text: c_1_7_2, style: "texto_justificado_bold"},
                {text: c_1_7_3},
                {text: c_1_7_4, style: "texto_justificado_bold"},
                {text: c_1_7_5},
                {text: c_1_7_6, style: "texto_justificado_bold"},
                {text: c_1_7_7},
                {text: c_1_7_8, style: "texto_justificado_bold"},
                {text: c_1_7_9},
                {text: c_1_7_10, style: "texto_justificado_bold"},
                {text: c_1_7_11},
                {text: c_1_7_12, style: "texto_justificado_bold"},
                {text: c_1_7_13},
                {text: c_1_7_14, style: "texto_justificado_bold"},
                {text: c_1_7_15},
              ], style: "texto_justificado", colSpan:4 }, {}, {}, {} ],
              [{ text: [
                {text: c_1_8_1, style: "texto_justificado_bold"},
                {text: c_1_8_2},
                {text: c_1_8_3, style: "texto_justificado_bold"},
                {text: c_1_8_4},
                {text: c_1_8_5, style: "texto_justificado_bold",decoration: 'underline'},
                
              ], style: "texto_justificado", colSpan:4 }, {}, {}, {} ],
              [{ text: [
                {text: c_1_9_1, style: "texto_justificado_bold"},
                {text: c_1_9_2},
                {text: c_1_9_3, style: "texto_justificado_bold"},
                {text: c_1_9_4},
                {text: c_1_9_5, style: "texto_justificado_bold"},
                {text: c_1_9_6},
              ], style: "texto_justificado", colSpan:4 }, {}, {}, {} ],
              [{ text: c_1_10, style: "texto_justificado", colSpan:4 }, {}, {}, {} ],
              [{ text: c_1_11, style: "texto_centrado_bold", colSpan:4 }, {}, {}, {} ],
              [{ text: [
                {text: c_1_12_1},
                {text: c_1_12_2, style: "texto_centrado_bold"},
                {text: c_1_12_3},
                {text: c_1_12_4, style: "texto_centrado_bold"},
                {text: c_1_12_5},
                {text: c_1_12_6, style: "texto_centrado_bold"},
                {text: c_1_12_7},
                
              ], style: "texto_justificado", colSpan:4 }, {}, {}, {} ]
            ]
          }
        }

        let firmantes_1 = "DR. FRANCISCO ARTURO MARISCAL OCHOA\nEncargado del Despacho de la Secretaría de Salud y de la Dirección General del Instituto De Salud"; 
        let firmantes_2 = 'ROBERTO SANCHEZ MOSCOSO\nCoordinador Estatal de Chiapas del  "IMSS-BIENESTAR"';
        let firmantes_3 = "";
        let firmantes_4 = 'ROSALBA MORALES GARCIA\nJefe de Servicios de atención a la salud de la Coordinación Estatal de Chiapas del "IMSS-BIENESTAR"';
        let firmantes_5 = "LIC. MARIA ESTHER GARCÍA RUÍZ\nSecretaría de Hacienda";
        let firmantes_6 = 'ERNESTO GUTIÉRREZ COELLO\nJefe de Servicios Jurídicos de la Coordinación Estatal de Chiapas del "IMSS-BIENESTAR"';
        let firmantes_7 = "DR. CORAZÓN DE JESÚS PÉREZ MEDINA\nEncargado de la Dirección del Instituto del Patrimonio en el Estado";
        let firmantes_8 = 'MANUEL ANTONIO MORENO ALVAREZ\nJefe de Departamento Administrativo de la coordinación Estatal de Chiapas del "IMSS- BIENESTAR"';
        let elaboro = registro.responsable;
        let informacion_bloque_2 = {
          layout: 'noBorders',
          pageBreak:'after',
          //margin: [11,margen_tabla,0,0],
          //absolutePosition: {x: 49, y: margen_tabla},
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [{ text: "\n\n\n\n\n_________________________________________________\n"+firmantes_1, style: "texto_centrado", colSpan:2 },{}, { text: "\n\n\n\n\n_________________________________________________\n"+firmantes_2, style: "texto_centrado" , colSpan:2 },{} ],
              [{ text: firmantes_3, style: "texto_centrado" , colSpan:2 },{}, { text: "\n\n\n\n\n_________________________________________________\n"+firmantes_4, style: "texto_centrado" , colSpan:2 },{} ],
              [{ text: "\n\n\n\n\n\n\n\n\n\n_________________________________________________\n"+firmantes_5, style: "texto_centrado" , colSpan:2 },{}, { text: "\n\n\n\n\n\n\n\n\n\n_________________________________________________\n"+firmantes_6, style: "texto_centrado" , colSpan:2 },{} ],
              [{ text: "\n\n\n\n\n_________________________________________________\n"+firmantes_7, style: "texto_centrado" , colSpan:2 },{}, { text: "\n\n\n\n\n_________________________________________________\n"+firmantes_8, style: "texto_centrado" , colSpan:2 },{} ],
              [{ text: "ELABORO\n\n\n\n\n_________________________________________________\n"+elaboro, style: "texto_centrado",colSpan:4 } , {},{},{} ],
            ]
          }
        }
        //Fin Anexo 1
        //Anexo 2
        let c_2_1 = "ANEXO 2";
        let c_2_2 = "MODELO ACTA ENTREGA RECEPCIÓN DE LOS INMUEBLES\n\n";
        let c_2_3_1 = 'ACTA QUE CELEBRAN, POR UNA PARTE EL SECRETARIO DE SALUD Y DIRECTOR GENERAL DEL INSTITUTO DE SALUD EN EL ESTADO DE CHIAPAS, EN LO SUCESIVO "LA SSA" REPRESENTADA POR EL '+
        "DR. FRANCISCO ARTURO MARISCAL OCHOA  ENCARGADO DEL DESPACHO DE LA SECRETARIA DE SALUD Y DE LA DIRECCIÓN GENERAL DEL INSTITUTO DE SALUD, EN SU CALIDAD DE OTORGANTE, "+
        "ASISTIDO POR LA LIC. MARIA ESTHER GARCÍA RUÍZ SECRETARIA DE HACIENDA Y DR. CORAZÓN DE JESUS PÉREZ MEDINA, ENCARGADO DE LA DIRECCIÓN DEL INSTITUTO DEL PATRIMONIO EN "+
        "EL ESTADO  CHIAPAS,Y POR OTRA, EN CALIDAD DE RECEPTOR EL ORGANISMO PÚBLICO DESCENTRALIZADO DENOMINADO SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL "+
        'PARA EL BIENESTAR,  EN LO SUCESIVO "EL IMSS-BIENESTAR", REPRESENTADO EN ESTE ACTO POR EL COORDINADOR ESTATAL EN CHIAPAS, EL DR. ROBERTO SANCHEZ MOSCOSO ';
        let c_2_3_2 = "ASISTIDOS POR LOS ";
        let c_2_3_3 = "JEFES DE SERVICIOS DE ATENCIÓN A LA SALUD, JEFES DE SERVICIOS JURÍDICOS Y EL JEFE DE DEPARTAMENTO ADMINISTRATIVO RESPECTIVAMENTE DE LA REFERIDA COORDINACIÓN, "+
        "LOS CC: ROSALBA MORALES GARCIA, ERNESTO GUTIERREZ COELLO Y MANUEL ANTONIO MORENO ALVAREZ, ";
        let c_2_3_4 = "PARA HACER CONSTAR LA ENTREGA-RECEPCIÓN FÍSICA Y JURÍDICA DE LA UNIDAD DE SALUD DENOMINADA ";
        let c_2_3_5 = "("+registro.nombre_unidad+")";
        let c_2_3_6 = ", CLUES ";
        let c_2_3_7 = "("+registro.clues+")";
        let c_2_3_8 = ", CON MOTIVO DEL CONVENIO ESPECÍFICO DE COORDINACIÓN PARA LA TRANSFERENCIA DE LOS BIENES INMUEBLES "+
        "RELACIONADOS CON LOS ESTABLECIMIENTOS DE SALUD A QUE SE REFIERE LA CLÁUSULA SEGUNDA Y ANEXO 1 DEL CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE COLABORACIÓN EN "+
        "MATERIA DE PERSONAL, INFRAESTRUCTURA, EQUIPAMIENTO, MEDICAMENTOS Y DEMÁS INSUMOS ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE SERVICIOS DE SALUD, PARA LAS PERSONAS SIN "+
        'SEGURIDAD SOCIAL, CELEBRADO ENTRE "EL IMSS-BIENESTAR" Y GOBIERNO DEL ESTADO DE CHIAPAS EL 15 DE MARZO DEL 2024.\n\n\n';
        
        let c_2_4_1 = 'En ';
        let c_2_4_2 = registro.localidad;
        let c_2_4_3 = ", siendo las ";
        let c_2_4_4 = "09:00 ";
        let c_2_4_5 = "horas del día ";
        let c_2_4_6 = "15 de marzo ";
        let c_2_4_7 = "del año dos mil veinticuatro, se reunieron los representantes de ";
        let c_2_4_8 = '"LA SSA" ';
        let c_2_4_9 = "y de ";
        let c_2_4_10 = '"EL IMSS-BIENESTAR"';
        let c_2_4_11 = "con la finalidad de llevar acabo el acto de entrega – recepción física y jurídica del inmueble e instalaciones especiales, con la documentación técnica; en virtud del ";
        let c_2_4_12 = "CONVENIO ESPECÍFICO DE COORDINACIÓN PARA LA TRANSFERENCIA DE LOS BIENES INMUEBLES RELACIONADOS CON LOS ESTABLECIMIENTOS DE SALUD A QUE SE REFIERE LA CLÁUSULA SEGUNDA "+
        "Y ANEXO 1 DEL CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE COLABORACIÓN EN MATERIA DE PERSONAL, INFRAESTRUCTURA, EQUIPAMIENTO, MEDICAMENTOS Y DEMÁS INSUMOS "+
        'ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE SERVICIOS DE SALUD, PARA LAS PERSONAS SIN SEGURIDAD SOCIAL ';
        let c_2_4_13 = "celebrado entre ";
        let c_2_4_14 = '"EL IMSS-BIENESTAR" ';
        let c_2_4_15 = "y ";
        let c_2_4_16 = 'GOBIERNO DEL ESTADO DE CHIAPAS ';
        let c_2_4_17 = "el ";
        let c_2_4_18 = "15 de Marzo de 2024";
        let c_2_4_19 = ", la cual será transferida para prestar gratuitamente los servicios de salud, medicamentos y demás insumos asociados a la población sin seguridad "+
        'social en esa Entidad Federativa, con base al modelo de atención que opera el ';
        let c_2_4_20 = '"IMSS-BIENESTAR".\n\n';
        let c_2_5 = "DE LA ENTREGA Y RECEPCIÓN\n\n";
        let c_2_6_1 = 'PRIMERO.- ';
        let c_2_6_2 = "Con la presente acta se hace constar que ";
        let c_2_6_3 = '"LA SSA" ';
        let c_2_6_4 = "entregan el inmueble que ocupa la unidad de salud denominada ";
        let c_2_6_5 = "("+registro.nombre_unidad+") "+registro.clues;
        let c_2_6_6 = ", ubicada en ";
        let c_2_6_7 = registro.vialidad+" ";
        let c_2_6_8 = "libre de cargas, gravámenes y de cualquier responsabilidad jurídica contra terceros por deudas contraídas respecto de dicho inmueble.\n\n";
        
        let c_2_7_1 = 'SEGUNDO.- "EL IMSS-BIENESTAR"';
        let c_2_7_2 = ", recibe el inmueble de conformidad con el Convenio específico de coordinación para la transferencia de los bienes inmuebles relacionados con los "+
        "establecimientos de salud a que se refiere la cláusula segunda y anexo 1 del convenio de coordinación que se establece la forma de colaboración en materia de personal, "+
        "infraestructura, equipamiento, medicamentos y demás insumos asociados para la prestación gratuita de servicios de salud, para las personas sin seguridad social, "+
        'celebrado entre ';
        let c_2_7_3 = '"EL IMSS-BIENESTAR" ';
        let c_2_7_4 = "y ";
        let c_2_7_5 = '"GOBIERNO DEL ESTADO DE CHIAPAS"';
        let c_2_7_6 = ' el 15 de Marzo de dos mil veinticuatro.\n\n';

        let c_2_8_1 = '"EL IMSS-BIENESTAR" ';
        let c_2_8_2 = "en un término de ";
        let c_2_8_3 = "120 ";
        let c_2_8_4 = 'días naturales contados a partir de la fecha de firma de la presente, realizará la verificación de los bienes recibidos '+
        "en coordinación con las entidades federativas y podrá requerir las aclaraciones correspondientes, además formulará las observaciones que, en su caso, considere "+
        "pertinentes respecto de la documentación técnica.\n\n";

        let c_2_9_1 = 'TERCERO.- "LA SSA"';
        let c_2_9_2 = ', informa que el Bien Inmueble objeto de la presente entrega-recepción no cuenta con el avalúo o valor catastral determinado por la '+
                      "autoridad facultada para tal efecto.\n\n";

        let c_2_10_1 = 'CUARTO.- "LAS PARTES" ';
        let c_2_10_2 = 'cuerdan que ';
        let c_2_10_3 = '"EL IMSS-BIENESTAR"';
        let c_2_10_4 = ', se hará cargo del pago de los servicios generales, de conservación, así como todos aquellos '+
                      "inherentes a la propiedad de la unidad de salud ";
        let c_2_10_5 = registro.nombre_unidad+" ";
        let c_2_10_6 = "en el momento en que los recursos correspondientes sean "+
                      "transferidos al Fondo de Salud para el Bienestar (FONSABI), en términos de  lo establecido en la Cláusula Sexta, inciso g), último párrafo del Convenio "+
                      'Coordinación, dejando de manifiesto que los contratos celebrados o adeudos generados previamente o en trámite de pago, serán cubiertos por ';
        let c_2_10_7 = '"LA SSA".\n\n';
        
        let c_2_11_1 = 'QUINTO.- ';
        let c_2_11_2 = 'En este acto la ';
        let c_2_11_3 = 'Coordinación Estatal de "EL IMSS-BIENESTAR" ';
        let c_2_11_4 = 'recibe en resguardo el expediente documental integrado por la Entidad Federativa '+
                      "respecto del Inmueble a transferir, el cual se anexa a la presente acta como ANEXO UNICO, el cual pasa a formar parte integrante de la misma.\n\n";
        let c_2_12_1 = 'SEXTO.- "EL IMSS-BIENESTAR" ';
        let c_2_12_2 = 'recibe de manera integral, en este acto, el inmueble a fin de brindar servicios de salud a la población sin seguridad social en '+
                      "términos de lo pactado en el ";
        let c_2_12_3 = "CONVENIO ESPECÍFICO DE COORDINACIÓN PARA LA TRANSFERENCIA DE LOS BIENES INMUEBLES RELACIONADOS CON LOS ESTABLECIMIENTOS DE SALUD "+
                      "A QUE SE REFIERE LA CLÁUSULA SEGUNDA Y ANEXO 1 DEL CONVENIO DE COORDINACIÓN QUE SE ESTABLECE LA FORMA DE COLABORACIÓN EN MATERIA DE PERSONAL, INFRAESTRUCTURA, "+
                      "EQUIPAMIENTO, MEDICAMENTOS Y DEMÁS INSUMOS ASOCIADOS PARA LA PRESTACIÓN GRATUITA DE SERVICIOS DE SALUD, PARA LAS PERSONAS SIN SEGURIDAD SOCIAL ";
        let c_2_12_4 = "y conforme a las disposiciones jurídicas aplicables.\n\n";
        let c_2_13 = "Procediendo a la formalización de la Acta Entrega-Recepción del bien inmueble transferido, de conformidad con lo establecido en el artículo 15, de las BASES PARA "+
                      "LA RECEPCIÓN DE BIENES MUEBLES E INMUEBLES QUE TRANSFIERAN A FAVOR DE LOS SERVICIOS DE SALUD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL PARA EL BIENESTAR "+
                      "(IMSS-BIENESTAR).\n\n";
        let c_2_14 = "CIERRE DEL ACTA\n\n";
        let c_2_15_1 = "Leída la presente acta y conformes con su contenido y alcance legal, los que en ella intervienen la suscriben por cuadruplicado y manifiestan que es cierto lo "+
                    "que en ella se asienta. No teniendo más que agregar se da por concluida siendo las ";
        let c_2_15_2 = "12:00 ";
        let c_2_15_3 = "horas, del día 15 de Marzo de dos mil veinticuatro.";
        
        let informacion_bloque_3 = {
          layout: 'noBorders',
          pageBreak:'',
          //margin: [11,margen_tabla,0,0],
          //absolutePosition: {x: 49, y: margen_tabla},
          table: {
            widths: ['*', '*'],
            body: [
              [{ text: c_2_1, style: "texto_centrado_bold", colSpan:2 }, {} ],
              [{ text: c_2_2, style: "texto_centrado_bold", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_3_1, style: "texto_justificado_bold"},
                {text: c_2_3_2},
                {text: c_2_3_3, style: "texto_justificado_bold"},
                {text: c_2_3_4},
                {text: c_2_3_5, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_2_3_6},
                {text: c_2_3_7, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_2_3_8, style: "texto_justificado_bold"},
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_4_1},
                {text: c_2_4_2,decoration: 'underline'},
                {text: c_2_4_3},
                {text: c_2_4_4, style: "texto_justificado_bold"},
                {text: c_2_4_5},
                {text: c_2_4_6, style: "texto_justificado_bold"},
                {text: c_2_4_7},
                {text: c_2_4_8, style: "texto_justificado_bold"},
                {text: c_2_4_9},
                {text: c_2_4_10, style: "texto_justificado_bold"},
                {text: c_2_4_11},
                {text: c_2_4_12, style: "texto_justificado_bold"},
                {text: c_2_4_13},
                {text: c_2_4_14, style: "texto_justificado_bold"},
                {text: c_2_4_15},
                {text: c_2_4_16, style: "texto_justificado_bold"},
                {text: c_2_4_17},
                {text: c_2_4_18, style: "texto_justificado_bold"},
                {text: c_2_4_19},
                {text: c_2_4_20, style: "texto_justificado_bold"},
              ], style: "texto_justificado", colSpan:2 }, {} ],
            ]
          }
        }
        let informacion_bloque_4 = {
          layout: 'noBorders',
          pageBreak:'after',
          //margin: [11,margen_tabla,0,0],
          //absolutePosition: {x: 49, y: margen_tabla},
          table: {
            widths: ['*', '*'],
            body: [
              [{ text: c_2_5, style: "texto_centrado_bold", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_6_1, style: "texto_justificado_bold"},
                {text: c_2_6_2},
                {text: c_2_6_3, style: "texto_justificado_bold"},
                {text: c_2_6_4},
                {text: c_2_6_5, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_2_6_6},
                {text: c_2_6_7, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_2_6_8},
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_7_1, style: "texto_justificado_bold"},
                {text: c_2_7_2},
                {text: c_2_7_3, style: "texto_justificado_bold"},
                {text: c_2_7_4},
                {text: c_2_7_5, style: "texto_justificado_bold"},
                {text: c_2_7_6},
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_8_1, style: "texto_justificado_bold"},
                {text: c_2_8_2},
                {text: c_2_8_3, style: "texto_justificado_bold"},
                {text: c_2_8_4},
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_9_1, style: "texto_justificado_bold"},
                {text: c_2_9_2},
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_10_1, style: "texto_justificado_bold"},
                {text: c_2_10_2},
                {text: c_2_10_3, style: "texto_justificado_bold"},
                {text: c_2_10_4},
                {text: c_2_10_5, style: "texto_justificado_bold",decoration: 'underline'},
                {text: c_2_10_6},
                {text: c_2_10_7, style: "texto_justificado_bold"}
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_11_1, style: "texto_justificado_bold"},
                {text: c_2_11_2},
                {text: c_2_11_3, style: "texto_justificado_bold"},
                {text: c_2_11_4},
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_12_1, style: "texto_justificado_bold"},
                {text: c_2_12_2},
                {text: c_2_12_3, style: "texto_justificado_bold"},
                {text: c_2_12_4},
              ], style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: c_2_13, style: "texto_justificado", colSpan:2 }, {} ],
              [{ text: c_2_14, style: "texto_centrado_bold", colSpan:2 }, {} ],
              [{ text: [
                {text: c_2_15_1},
                {text: c_2_15_2, style: "texto_justificado_bold"},
                {text: c_2_15_3},
              ], style: "texto_justificado", colSpan:2 }, {} ]
            ]
          }
        }

        let informacion_bloque_5 = {
          layout: 'noBorders',
          pageBreak:'',
          //margin: [11,margen_tabla,0,0],
          //absolutePosition: {x: 49, y: margen_tabla},
          table: {
            widths: ['*', '*'],
            body: [
              [{ text: "\n\n\n\n\n_________________________________________________\n"+firmantes_1, style: "texto_centrado" }, { text: "\n\n\n\n\n_________________________________________________\n"+firmantes_2, style: "texto_centrado" } ],
              [{ text: firmantes_3, style: "texto_centrado" }, { text: "\n\n\n\n\n_________________________________________________\n"+firmantes_4, style: "texto_centrado" } ],
              [{ text: "\n\n\n\n\n_________________________________________________\n"+firmantes_5, style: "texto_centrado" }, { text: "\n\n\n\n\n_________________________________________________\n"+firmantes_6, style: "texto_centrado" } ],
              [{ text: "\n\n\n\n\n_________________________________________________\n"+firmantes_7, style: "texto_centrado" }, { text: "\n\n\n\n\n_________________________________________________\n"+firmantes_8, style: "texto_centrado" } ],
              [{ text: "ELABORO\n\n\n\n\n_________________________________________________\n"+elaboro, style: "texto_centrado",colSpan:2 } , { } ],
            ]
          }
        }
        //Fin anexo 2
        //Cabecera

        datos.content.push(informacion_bloque_1);
        datos.content.push(informacion_bloque_2);

        datos.content.push(informacion_bloque_3);
        datos.content.push(informacion_bloque_4);
        datos.content.push(informacion_bloque_5);
      
        return datos;
      }
}