import { analytics } from "@angular-devkit/core";
import { LOGOS } from "../../logos";


export class ReporteComision {

  getDocumentDefinition(reportData:any) {
          
    let data = reportData.items;
     
    let responsables = reportData.responsable;   
    let director = responsables.direccion_admon.responsable;
    let secretario = responsables.secretario.responsable;
    let subdirector_rh = responsables.subdireccion_rh.responsable;
    let depto_rh = responsables.relaciones_laborales.responsable;
    let sistematizacion = responsables.sistematizacion.responsable;
    let control = responsables.control.responsable;
    
    let juridico = responsables.juridico.responsable;
    let nombre_secretario = "C.C.P. DR. "+secretario.nombre+" "+secretario.apellido_paterno+" "+secretario.apellido_materno+" - SECRETARIO DE SALUD Y DIRECTOR GENERAL DEL INSTITUTO DE SALUD";
    let nombre_rh = subdirector_rh.nombre+" "+subdirector_rh.apellido_paterno+" "+subdirector_rh.apellido_materno+" - "+responsables.subdireccion_rh.cargo;
    let nombre_depto_rh = depto_rh.nombre+" "+depto_rh.apellido_paterno+" "+depto_rh.apellido_materno+" - "+responsables.relaciones_laborales.cargo;
    let nombre_director = director.nombre+" "+director.apellido_paterno+" "+director.apellido_materno+"\n"+responsables.direccion_admon.cargo;
    let nombre_juridico = juridico.nombre+" "+juridico.apellido_paterno+" "+juridico.apellido_materno+" - "+responsables.juridico.cargo;
    let nombre_control = control.nombre+" "+control.apellido_paterno+" "+control.apellido_materno+" - "+responsables.control.cargo;
    let nombre_sistematizacion = sistematizacion.nombre+" "+sistematizacion.apellido_paterno+" "+sistematizacion.apellido_materno+" - "+responsables.sistematizacion.cargo;

    let elaboracion = responsables.elaboracion;
    let nombre_elaboracion = "";
    if(elaboracion != null)
    {
      nombre_elaboracion = elaboracion.nombre+" "+elaboracion.apellido_paterno+" "+elaboracion.apellido_materno+" - ADMINISTRATIVO";
    }
    let fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());

    let datos = {
      pageOrientation: 'portrait',
      pageSize: 'LETTER',

      pageMargins: [ 40, 65, 40, 45 ],
      header: {
        margin: [30, 20, 30, 0],
        columns: [
            {
              image: LOGOS[0].LOGO_FEDERAL,
                width: 90
            },
            {
                margin: [10, 0, 0, 0],
                text: "",
                italics: true,
                bold: false,
                fontSize: 8,
                alignment: 'center'
            },
            {
              image: LOGOS[1].LOGO_ESTATAL,
              width: 80
            }
        ]
      },
      footer: function(currentPage, pageCount) { 
        return {
          margin: [30, 20, 30, 0],
          columns: [
              {
                  text:'Unidad Administrativa. Edificio "C" Col. Maya. C.P. 29010, Tuxtla Gutiérrez, Chiapas.\n'+'Conmutador (961) 6189250 '+' www.saludchiapas.gob.mx/',
                  alignment:'left',
                  fontSize: 7,
              },
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
          texto_depto:
          {
            bold: true,
            alignment:"left",
            fontSize: 10,
          },
          texto_depto_derecha:
          {
            bold: true,
            alignment:"right",
            fontSize: 10,
          },
          texto_oficio_notificacion:
          {
            bold: true,
            alignment:"right",
            fontSize: 11,
          },
          texto_num_oficio:
          {
            bold: true,
            alignment:"right",
            fontSize: 8
          },
          texto_contenido:
          {
            bold: false,
            alignment:"justify",
            fontSize: 7.5
          },
          contenido_notificacion:
          {
            bold: false,
            alignment:"justify",
            fontSize: 12
          },
          texto_copias:
          {
            bold: false,
            alignment:"justify",
            fontSize: 6
          }
        }
    };

    let iteracciones = 1;
    data.forEach(element => {
      
      let trabajador = element;
      let datos_nominales  = trabajador.rel_datos_laborales_nomina;
      let secretario = nombre_secretario+"\n";//Esto es por si a donde va a llegar es a la direccion general
      let anio_oficio = element.rel_trabajador_comision_interna.fecha_oficio.substr(0,4);

      if(element.rel_trabajador_comision_interna.fecha_oficio != null)
      {
        fecha_hoy = this.convertirFechaTexto(element.rel_trabajador_comision_interna.fecha_oficio).toLowerCase();
      }
      
      if(anio_oficio == 2021)
      {
        datos.header.columns[1].text = "\n\n2021, Año de la Independencia";
      }else if(anio_oficio == 2022){
        datos.header.columns[1].text = "\n\n2022, AÑO DE RICARDO FLORES MAGÓN,  PRECURSOR DE LA REVOLUCIÓN MEXICANA";
      }else if(anio_oficio == 2023){
        datos.header.columns[1].text = "\n\n\"2023, Año de Francisco Villa, el Revolucionario del Pueblo\"";
      }else{
        datos.header.columns[1].text = "\n\n";
      }
      
      
      let comision_inicio = element.rel_trabajador_comision_interna;
      let mes_inicio = (parseInt(comision_inicio.fecha_inicio.substr(5,2)) - 1);
      let mes_fin = (parseInt(comision_inicio.fecha_fin.substr(5,2)) - 1);

      let fecha_inicio =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(comision_inicio.fecha_inicio.substr(0,4), mes_inicio,comision_inicio.fecha_inicio.substr(8,2)));
      let fecha_fin =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(comision_inicio.fecha_fin.substr(0,4), mes_fin,comision_inicio.fecha_fin.substr(8,2)));

      let TipoTrabajador = "";
      switch (datos_nominales.ur) {
        case "420": 
        case "416": TipoTrabajador = "BASE"; break;
        case "HOM": TipoTrabajador = "HOMOLOGADO"; break;
        case "REG": TipoTrabajador = "REGULARIZADO"; break;
        case "FO2": 
        case "FO3": 
        case "FOR": TipoTrabajador="FORMALIZADO"; break;
        default: TipoTrabajador = "EVENTUAL"; break;
      }

      let clave = "";
      switch (datos_nominales.ur) {
        case "420": 
        case "416": clave=" con clave presupuestal de base: "+datos_nominales.clave_presupuestal; break;
        case "HOM": clave=" con clave presupuestal de HOMOLOGADO: "+datos_nominales.clave_presupuestal; break;
        case "REG": clave=" con clave presupuestal de REGULARIZADO: "+datos_nominales.clave_presupuestal; break;
        case "FO2": 
        case "FO3": 
        case "FOR": clave=" con clave presupuestal de FORMALIZADO: "+datos_nominales.clave_presupuestal; break;
      }

      
      let currentYear = new Date();

      let anio_actual = this.NumeroALetras(currentYear.getFullYear());
      let contenido = "";
      let nombre_trabajador = trabajador.nombre+" "+trabajador.apellido_paterno+" "+trabajador.apellido_materno;
      let codigo_trabajador = datos_nominales.codigo.descripcion+" "+datos_nominales.codigo_puesto_id;
      let comision = element.rel_trabajador_comision_interna;
      let destino = "SIN DESTINO";
      let periodo = fecha_inicio+" al "+fecha_fin;
      let responsable = "";
      let responsable_notificacion = "";
      let responsable_copia = "";

      if(comision.cr_destino)
      {
        destino = "( "+comision.cr_destino.clues.clasificacion+") "+comision.cr_destino.descripcion_actualizada+" "+comision.cr_destino.clues.clues;
        if(comision.cr_destino.dependencia)
        {
          let dato_responsable = comision.cr_destino.dependencia.directorio_responsable;
          let nombre_responsable = dato_responsable.responsable;
          responsable = "C. "+nombre_responsable.nombre+" "+nombre_responsable.apellido_paterno+" "+nombre_responsable.apellido_materno+", "+dato_responsable.cargo+", con domicilio ubicado en "+comision.cr_destino.dependencia.direccion;
          if(comision.cr_destino.dependencia.cr !="0700200001")
          {
            responsable_copia = "C.C.P. "+nombre_responsable.nombre+" "+nombre_responsable.apellido_paterno+" "+nombre_responsable.apellido_materno+" - "+dato_responsable.cargo+"\n";
            
          }else{
            secretario = "";
          }
          responsable_notificacion = "C. "+nombre_responsable.nombre+" "+nombre_responsable.apellido_paterno+" "+nombre_responsable.apellido_materno+"\n"+dato_responsable.cargo+"\n"+comision.cr_destino.municipio;
        }
      }

      if(comision.cr_destino.dependencia.cr ==responsables.control.cr || comision.cr_destino.dependencia.cr ==responsables.juridico.cr || comision.cr_destino.dependencia.cr ==responsables.sistematizacion.cr || comision.cr_destino.dependencia.cr ==responsables.subdireccion_rh.cr)
      {
        responsable_copia = "";
      }

      contenido = "En consideración que la protección a la salud, es un derecho humano, elevado a rango constitucional como lo establece el artículo 4º de la Ley Suprema; en relación con los dispositivos 1º, 2º  y 77 bis 1, de la Ley General de Salud, establecen que los servicios de salud y de asistencia social deben de satisfacer eficaz y oportunamente las necesidades de la población que carezcan de la seguridad social y estos conceptos, tienen el derecho de recibir de manera gratuita los servicios públicos de salud, que incluye medicamentos y demás insumos asociados sin importar la condición social de las personas.\n\n";
      let acuse_qr = "";
      switch (datos_nominales.ur) {
        case "420": 
        case "416": 
        case "HOM": 
        case "REG": 
        case "FO2": 
        case "FO3": 
        case "FOR": 
          acuse_qr = "Atento a lo anterior, con fundamento en el artículo 134 de la Ley Federal del Trabajo, 52 fracciones I, III, VI y XI y 53 de la Ley del Servicios Civil del Estado y los Municipios de Chiapas, 82, 133, 134 y demás relativos aplicables de las Condiciones Generales del Trabajo, por las necesidades del servicio y para los efectos de garantizar la demanda de atención médica que la población requiere de los servicios de salud; tengo a bien comunicarle a usted, que a partir del día "+periodo+", queda comisionado a "+destino+"; con su código funcional "+clave+" "+datos_nominales.codigo.descripcion+" "+datos_nominales.codigo_puesto_id+", por lo que deberá presentarse con el/la  "+responsable+", en un horario de 08:00 a las 15:00 horas, quien le indicará las actividades, horario y funciones a ejecutar.";
          contenido += acuse_qr+"\n\n";
          contenido += "Con fundamento en el CAPÍTULO IX, DE LA INTENSIDAD, CALIDAD Y PRODUCTIVIDAD EN EL TRABAJO, de las Condiciones Generales del Trabajo de la Secretaría de Salud, se le exhorta que deberá desempeñar los servicios encomendados, con aptitud, intensidad, calidad, eficacia, eficiencia, pulcritud y esmero, que por su propia naturaleza se demande en el desempeño y la realización de las actividades y funciones que debe desarrollar como trabajador en el entendido, que de no presentarse a laborar en los términos señalados en el presente, se aplicara la normatividad que rigen a la Institución para tal efecto.\n\n";
        
        break;
        default:
          acuse_qr ="Atento a lo anterior, con fundamento en el artículo 134 de la Ley Federal del Trabajo, 52 fracciones I, III, VI y XI y 53 de la Ley del Servicios Civil del Estado y los Municipios de Chiapas, así como de la CLÁUSULA QUINTA del Contrato Individual de Trabajo por tiempo determinado de fecha primero de enero del año "+anio_actual+", por las necesidades del servicio y para los efectos de garantizar la demanda de atención médica que la población requiere de los servicios de salud; tengo a bien comunicarle a usted, que a partir del día "+periodo+", queda comisionado a "+destino+"; con su código funcional "+datos_nominales.codigo.descripcion+" "+datos_nominales.codigo_puesto_id+", por lo que deberá presentarse con el/la  "+responsable+", en un horario de 08:00 a las 15:00 horas, quien le indicará las actividades, horario y funciones a ejecutar.";
          contenido += acuse_qr+"\n\n";
          contenido += "Con fundamento en el artículo 52 de la Ley del Servicio Civil del Estado y los Municipios de Chiapas, se le exhorta que deberá desempeñar los servicios encomendados en el contrato que tiene celebrado con la Secretaría de Salud del Estado de Chiapas e Instituto de Salud, con aptitud, intensidad, calidad, eficacia, eficiencia, pulcritud y esmero, que por su propia naturaleza se demande en el desempeño y la realización de las actividades y funciones que debe desarrollar como trabajador con el puesto para lo cual fue contratado; en el entendido, que de no presentarse a laborar en los términos señalados en el presente, se aplicara la normatividad que rige a la Institución para tal efecto.\n\n";
            
        break;
      }

    

      contenido += "Asimismo se le informa que al término de la presente comisión, deberá reincorporarse a la unidad de su adscripción como lo establece el artículo 151 de las Condiciones Generales de Trabajo; sin que sea necesario se le notifique de nueva cuenta su reincorporación a su centro de adscripción.\n\n";
      contenido += "Cabe hacer mención, que la continuidad de prórroga de comisión, no le da el derecho de antigüedad, para cambio de adscripción, donde actualmente se encuentra comisionado.";
      contenido += "Lo que comunico a Usted, para los efectos legales a que haya lugar.";
      
      //console.log(iteracciones+" "+trabajador.nombre+" "+trabajador.apellido_paterno+" "+trabajador.apellido_materno+" "+acuse_qr.length);
      let dato_origen = "";
      let unidad_origen = "";
      if(comision.cr_origen)
      {
        if(comision.cr_origen.clues.clasificacion == "H. G." || comision.cr_origen.clues.clasificacion == "CLINICA" || comision.cr_origen.clues.clasificacion == "CLINICA DE ESPECIALIDADES" || comision.cr_origen.clues.clues == "CSSSA017213")
        {
          //dato_origen= comision.cr_origen;
          unidad_origen = "C.C.P. ("+comision.cr_origen.clues.clasificacion+") "+comision.cr_origen.clues.nombre_unidad;
        }else
        {
          let directorio = comision.cr_origen.dependencia.directorio_responsable;
          let responsable = directorio.responsable;
          dato_origen= "C.C.P. "+responsable.nombre+" "+responsable.apellido_paterno+" "+responsable.apellido_materno+" "+directorio.cargo+"\n";
          unidad_origen = comision.cr_origen.dependencia.descripcion_actualizada;
        }
      }

      let num_oficio        = comision.folio;
      let num_notificacion  = comision.folio + 1; 
      let informacion_oficio = {
        layout: 'noBorders',
        pageBreak:'',
        table: {
          widths: [400,'*'],
          margin: [0,0,0,0],
          body: [
           
            
            [
              { text: "SECRETARÍA DE SALUD\n INSTITUTO DE SALUD\n DIRECCIÓN DE ADMINISTRACIÓN Y FINANZAS\n SUBDIRECCIÓN DE RECURSOS HUMANOS\n DEPTO. DE RELACIONES LABORALES", style: "texto_depto", colSpan:2},{},
            ],
            [
              { text: "OFICIO: IS/DAF/SRH/DRL-COM/"+num_oficio.toString().padStart(6, "0")+"/"+anio_oficio+"\nASUNTO: SE COMUNICA COMISIÓN\nTUXTLA GUTIÉRREZ, CHIAPAS; A "+fecha_hoy.toUpperCase(), style: "texto_depto_derecha", colSpan:2},{},
            ],
            [
              { text: "\nC. "+nombre_trabajador+"\n"+
              codigo_trabajador+"\n"+
              TipoTrabajador+". ("+datos_nominales.clues.clasificacion+") "+datos_nominales.cr.descripcion_actualizada+" "+datos_nominales.cr.clues+"\nPRESENTE.\n\n", style: "texto_depto", colSpan:2},{},
            ],
            [
              { text: contenido.toUpperCase(), style: "texto_contenido", colSpan:2},{},
            ],
            [
              { text: "\n", style: "texto_num_oficio", colSpan:2},{},
            ],
            [
              { text: "A T E N T A M E N T E\n\n\n\n\n\n\n"+"L.A. "+nombre_director+"\n\n", style: "texto_depto"},
              {qr: acuse_qr.toUpperCase(), fit: "180"},
            ],
            [
              { text: nombre_secretario.toUpperCase()+"\n"+
                      responsable_copia.toUpperCase()+
                      dato_origen.toUpperCase()+
                      "C.C.P. GERARDO ESPINOSA CIFUENTES.- CONTRALOR INTERNO\n"+
                      "C.C.P. "+nombre_juridico+"\n"+
                      "C.C.P. "+nombre_sistematizacion+"\n"+
                      "C.C.P. "+nombre_control+"\n"+
                      "C.C.P. SINDICATO NACIONAL DE LOS TRABAJADORES DE LA SECRETARIA DE SALUD - - -\n\n"+
                      "Vo.Bo.: "+nombre_rh+"\n"+
                      "REVISO.: "+nombre_depto_rh+"\n"+
                      "ELABORO.: "+nombre_elaboracion
                      , style: "texto_copias", colSpan:2},{},
            ],
          ]
        }
      };
      informacion_oficio.pageBreak = 'after';

      let dato_unidad = "Jurisdicción";
      if(comision.cr_destino)
      {
        if(comision.cr_destino.clues.clasificacion == "H. G." || comision.cr_destino.clues.clasificacion == "CLINICA" || comision.cr_destino.clues.clasificacion == "CLINICA DE ESPECIALIDADES")
        {
          dato_unidad= "UNIDAD";
        }
      }

      
      
      let contenido_notificacion = "Por medio del presente, le hago del conocimiento que el/la C. "+trabajador.nombre+" "+trabajador.apellido_paterno+" "+trabajador.apellido_materno+", PERSONAL CON CÓDIGO DE "+datos_nominales.codigo.descripcion+" "+datos_nominales.codigo_puesto_id+",  a partir del día "+fecha_inicio+", fue comisionado a "+destino+", Chiapas; de esa "+dato_unidad+" a su cargo, por tal motivo, deberá asignarle las actividades, horario y funciones a ejecutar de acuerdo a su categoría, en el entendido, que de no presentarse a laborar deberá aplicar la normatividad que rige a la Institución para tal efecto; se adjunta copia de la comisión  para mayor constancia.\n\n";
      contenido_notificacion += "Por lo que, en 5 días hábiles a partir de la fecha de este documento, el encargado de recursos humanos deberá realizar la asignación de jornada y horario con numero de identificación de acuerdo a los controles de asistencia con los que cuente la unidad.\n\n";
      contenido_notificacion += "Lo que comunico a Usted, para los efectos legales a que haya lugar.";
      let notificacion = {
        layout: 'noBorders',
          pageBreak:'',
          table: {
            widths: [400,'*'],
            margin: [0,0,0,0],
            body: [
            [
              { text: "\n\n\n\nOFICIO NÚMERO: IS/DAF/SRH/DRL-COM/"+num_notificacion.toString().padStart(6, "0")+"/"+anio_oficio+"\nASUNTO: NOTIFICACIÓN\nTUXTLA GUTIÉRREZ, CHIAPAS; A "+fecha_hoy.toUpperCase()+"\n\n\n\n", style: "texto_oficio_notificacion", colSpan:2},{},
            ],
            [
              {text: responsable_notificacion.toUpperCase()+"\n\n\n", style:"contenido_notificacion", colSpan:2},{}
            ],
            [
              { text: contenido_notificacion.toUpperCase()+"\n\n", style: "contenido_notificacion", colSpan:2},{},
            ],
            [
              { text: "\n\n\n", style: "texto_num_oficio", colSpan:2},{},
            ],
            [
              { text: "A T E N T A M E N T E\n\n\n\n\n\n\n"+"L.A. "+nombre_director+"\n\n", style: "contenido_notificacion"},
              {},
            ],
            [
              { text:  secretario.toUpperCase()+
                      "C.C.P. GERARDO ESPINOSA CIFUENTES.- CONTRALOR INTERNO\n"+
                      "C.C.P. "+nombre_juridico+"\n"+
                      "C.C.P. "+unidad_origen+"\n\n"+
                      "Vo.Bo.: "+nombre_rh+"\n"+
                      "REVISO.: "+nombre_depto_rh+"\n"+
                      "ELABORO.: "+nombre_elaboracion, style: "texto_copias", colSpan:2},{}
            ]
          ]
        }
      };
      
      if(iteracciones != data.length)
      {
        notificacion.pageBreak = 'after';
      }
      
      datos.content.push(informacion_oficio);
      datos.content.push(notificacion);

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

  convertirNumero(anio)
  {
    anio.substr(1,2);
    
  }

  
  Unidades(num){

    switch(num)
    {
        case 1: return "UN";
        case 2: return "DOS";
        case 3: return "TRES";
        case 4: return "CUATRO";
        case 5: return "CINCO";
        case 6: return "SEIS";
        case 7: return "SIETE";
        case 8: return "OCHO";
        case 9: return "NUEVE";
    }

    return "";
  }//Unidades()

  Decenas(num){

    let decena = Math.floor(num/10);
    let unidad = num - (decena * 10);

    switch(decena)
    {
        case 1:
            switch(unidad)
            {
                case 0: return "DIEZ";
                case 1: return "ONCE";
                case 2: return "DOCE";
                case 3: return "TRECE";
                case 4: return "CATORCE";
                case 5: return "QUINCE";
                default: return "DIECI" + this.Unidades(unidad);
            }
        case 2:
            switch(unidad)
            {
                case 0: return "VEINTE";
                default: return "VEINTI" + this.Unidades(unidad);
            }
        case 3: return this.DecenasY("TREINTA", unidad);
        case 4: return this.DecenasY("CUARENTA", unidad);
        case 5: return this.DecenasY("CINCUENTA", unidad);
        case 6: return this.DecenasY("SESENTA", unidad);
        case 7: return this.DecenasY("SETENTA", unidad);
        case 8: return this.DecenasY("OCHENTA", unidad);
        case 9: return this.DecenasY("NOVENTA", unidad);
        case 0: return this.Unidades(unidad);
    }
  }//Unidades()

  DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
    return strSin + " Y " + this.Unidades(numUnidades)

    return strSin;
  }//DecenasY()

  Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch(centenas)
    {
        case 1:
            if (decenas > 0)
                return "CIENTO " + this.Decenas(decenas);
            return "CIEN";
        case 2: return "DOSCIENTOS " + this.Decenas(decenas);
        case 3: return "TRESCIENTOS " + this.Decenas(decenas);
        case 4: return "CUATROCIENTOS " + this.Decenas(decenas);
        case 5: return "QUINIENTOS " + this.Decenas(decenas);
        case 6: return "SEISCIENTOS " + this.Decenas(decenas);
        case 7: return "SETECIENTOS " + this.Decenas(decenas);
        case 8: return "OCHOCIENTOS " + this.Decenas(decenas);
        case 9: return "NOVECIENTOS " + this.Decenas(decenas);
    }

    return this.Decenas(decenas);
  }//Centenas()

  Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = this.Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
  }//Seccion()

  Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = this.Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = this.Centenas(resto);

    if(strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;
  }//Miles()

  Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMillones = this.Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = this.Miles(resto);

    if(strMillones == "")
        return strMiles;

    return strMillones + " " + strMiles;
  }//Millones()

  NumeroALetras(num) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),

    };

    return this.Millones(data.enteros);
  }//NumeroALetras()
}