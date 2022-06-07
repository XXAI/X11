import { LOGOS } from "../../logos";
export class ReporteTramiteDocumentacion{
    getDocumentDefinition(reportData:any) {
      console.log("entro");
      console.log(reportData);
      let fecha_reporte =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  Date.now();
        let datos = {
          pageOrientation: 'landscape',
          pageSize: 'LEGAL',
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
                    width: 80
                },
                {
                    margin: [10, 0, 0, 0],
                    text: 'SECRETARÍA DE SALUD\nREPORTE DE ACTIVIDADES DEL DÍA '+fecha_reporte.toUpperCase(),
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                },
                {
                  image: LOGOS[1].LOGO_ESTATAL,
                  width: 60
              }
            ]
          },
          footer: function(currentPage, pageCount) { 
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount; 
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'http://sirh.saludchiapas.gob.mx/',
                      alignment:'left',
                      fontSize: 8,
                  },
                  {
                      margin: [10, 0, 0, 0],
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 8,
                      alignment: 'center'
                  },
                  {
                    text:fecha_hoy.toString(),
                    alignment:'right',
                    fontSize: 8,
                }
              ]
            }
          },
          content: [
            
            ],
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
              tabla_datos_sindicato:
              {
                fontSize: 5,
                color: "red"
              }
            }
        };
      
        let clues = '';
        let cr = '';
        let indice_actual;

        datos.content.push({
          //layout: 'lightHorizontalLines',
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 300,'*','*','*' ],
            margin: [0,0,0,0],
            body: [
              [{text: "USUARIO", style: 'cabecera'},
               {text: "ACEPTADOS", style: 'cabecera'},
               {text: "RECHAZADOS", style: 'cabecera'},
               {text: "TOTAL", style: 'cabecera'}
              ]
            ]
          }
        });
        
        for(let i = 0; i < reportData.items.length; i++){
          let obj = reportData.items[i];
          datos.content[0].table.body.push(
            [{text: obj.usuario},
              {text: obj.aceptados},
              {text: obj.rechazados},
              {text: obj.aceptados + obj.rechazados}],
          );
          
        }

        reportData.items.forEach(element => {
          let indice = datos.content.length;
          datos.content.push({
            //layout: 'lightHorizontalLines',
            table: {
              headerRows:1,
              
              widths: [ 500,'*','*' ],
              margin: [0,0,0,0],
              body: [
                [{text: "USUARIO "+element.usuario.toUpperCase(), style: 'cabecera'},
                 {text: "CANTIDAD", style: 'cabecera'}
                ]
              ]
            }
          });
          element.detalles.forEach(element2 => {
            datos.content[indice].table.body.push(
              [{text: element2.descripcion},
                {text: element2.cantidad}],
            );
          });
          
        });
        

        return datos;
      }
}