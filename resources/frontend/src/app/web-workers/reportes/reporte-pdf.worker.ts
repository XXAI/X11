/// <reference lib="webworker" />
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReportePersonalActivo } from './reporte-personal-activo';
import { ReportePersonalActivoArea } from './reporte-personal-activo-area';
import { ReportePersonalAsistencia } from './reporte-personal-asistencia';
import { ReporteTrabajadorActivo } from './reporte-trabajador-activo';
import { ReporteTrabajadorCredencialSalud } from './reporte-personal-credencial-salud';
import { ReporteConstanciaDengue } from './reporte-constancia-dengue';
import { ReporteComision } from './reporte-comision';
import { ReporteComisionGerencial } from './reporte-comision-gerencial';
import { ReporteSolicitudComision } from './reporte-solicitud-comision';
import { ReporteTrabajadorCambioAdscripcion } from './reporte-cambio-adscripcion';
import { ReporteTrabajadorReincorporacion } from './reporte-reincorporacion';
import { ReporteTramiteDocumentacion } from './reporte-documentacion';
import { OpdFormato } from './opd-formato';
import { OpdFormatoAnexo } from './opd-formato-anexo3';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


const reportes = {
  'empleados/personal-activo': new ReportePersonalActivo(),
  'empleados/personal-activo-area': new ReportePersonalActivoArea(),
  'empleados/personal-asistencia': new ReportePersonalAsistencia(),
  'trabajador/personal-activo': new ReporteTrabajadorActivo(),
  'trabajador/credencial-salud': new ReporteTrabajadorCredencialSalud(),
  'trabajador/cambio-adscripcion': new ReporteTrabajadorCambioAdscripcion(),
  'trabajador/reincorporacion': new ReporteTrabajadorReincorporacion(),
  'trabajador/comision-interna': new ReporteComision(),
  'trabajador/comision-gerencial': new ReporteComisionGerencial(),
  'participante/constancia': new ReporteConstanciaDengue(),
  
  'archivo/solicitudComision': new ReporteSolicitudComision(),
  'tramites/reporte-documentacion': new ReporteTramiteDocumentacion(),
  'opd/formato': new OpdFormato(),
  'opd/formatoAnexo': new OpdFormatoAnexo()
};

addEventListener('message', ({ data }) => {
  const documentDefinition = reportes[data.reporte].getDocumentDefinition(data.data);
  let pdfReporte = pdfMake.createPdf(documentDefinition);

  pdfReporte.getBase64(function(encodedString) {
      let base64data = encodedString;
      //console.log(base64data);
      var bytes = atob( base64data ), len = bytes.length;
      var buffer = new ArrayBuffer( len ), view = new Uint8Array( buffer );
      for ( var i=0 ; i < len ; i++ )
        view[i] = bytes.charCodeAt(i) & 0xff;
      let file = new Blob( [ buffer ], { type: 'application/pdf' } );
      postMessage(file);
  });
});