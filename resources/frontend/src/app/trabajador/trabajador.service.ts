import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  url           = `${environment.base_url}/trabajador`;
  url_finalizar = `${environment.base_url}/trabajador_finalizar`;
  url_firmantes = `${environment.base_url}/firmantes`;
  url_catalogos = `${environment.base_url}/catalogo-trabajador`;
  url_buscador = `${environment.base_url}/buscador-datos-trabajador`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_trabajadores = `${environment.base_url}/busqueda-trabajadores`;
  url_trabajador = `${environment.base_url}/busqueda-firmantes`;
  url_info_trabajador = `${environment.base_url}/ver-info-trabajador/`;
  url_asistencia = 'http://sistematizacion.saludchiapas.gob.mx/api/consulta-asistencia';

  url_credencial = 'http://credencializacion.saludchiapas.gob.mx/ConsultaRhPersonal.php?buscar=';

  url_unlink = `${environment.base_url}/liberar-trabajador/`;

  url_cr = `${environment.base_url}/busqueda-cr`;
  url_activacion = `${environment.base_url}/activar-trabajador/`;
  url_validacion = `${environment.base_url}/validar-trabajador/`;
  url_baja = `${environment.base_url}/baja-trabajador`;
  /* Tranferencia */
  url_transfer = `${environment.base_url}/transferir-trabajador/`;
  url_clues_catalogo = `${environment.base_url}/busqueda-clues`;
  url_tramite = `${environment.base_url}/tramites`;
  url_tramite_trabajador = `${environment.base_url}/tramites-trabajador`;

  constructor(private http: HttpClient) { }

  getTrabajadorList(payload):Observable<any> {
      if(payload.reporte && payload.export_excel){
          return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
      }
      return this.http.get<any>(this.url, {params: payload}).pipe(
          map( response => {
            return response;
          })
      );
  }

  getFirmantesList():Observable<any> {
    return this.http.get<any>(this.url_firmantes,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  getCatalogos():Observable<any> {
      return this.http.get<any>(this.url_catalogos, {}).pipe(
          map( response => {
            return response;
          })
      );
  }


  buscar(payload):Observable<any>{
    return this.http.get<any>(this.url_buscador,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  buscarTrabajador(id:any, payload:any):Observable<any>{
    return this.http.get<any>(this.url + "/" + id, {params:payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };

  
  buscarTrabajadores(payload):Observable<any>{
    return this.http.get<any>(this.url_trabajadores,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  getCatalogoSindicato():Observable<any> {
    return this.http.get<any>(this.url_catalogos, {}).pipe(
        map( response => {
          return response;
        })
    );
  }

  bajaTrabajador(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url_baja + "/" + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  guardarNuevoTrabajador(payload:any):Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  guardarTrabajador(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url + "/" + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  
  guardarFinalizarTrabajador(id:any):Observable<any> {
    return this.http.put<any>(this.url_finalizar + "/" + id, []).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  //lista
  verInfoTrabajador(id:any,payload:any):Observable<any>{
    return this.http.get<any>(this.url_info_trabajador + id, {params:payload}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  desligarEmpleado(id:any):Observable<any> {
    return this.http.put<any>(this.url_unlink + id, {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  getDatosCredencial(clave_credencial:string):Observable<any> {
    return this.http.get<any>(this.url_credencial+clave_credencial, {}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  getFilterCatalogs():Observable<any>{
    return this.http.get<any>(this.url_filter_catalogs).pipe(
      map(response => {
        return response;
      })
    );
  }
  
  getDatosAsistencia(payload):Observable<any> {
    return this.http.get<any>(this.url_asistencia, {params: payload}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  buscarCr(payload):Observable<any>{
    return this.http.get<any>(this.url_cr,{params:payload}).pipe(
      map( response => {
        console.log(response);
        return response.data;
      })
    );
  };

  activarTrabajador(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url_activacion + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  validarTrabajador(id:any):Observable<any> {
    return this.http.put<any>(this.url_validacion + id, {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  agregarFirmante(payload) {
    return this.http.post<any>(this.url_firmantes,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  deleteFirmante(id){
    return this.http.delete<any>(this.url_firmantes+'/'+id,{}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  buscarResponsable(payload):Observable<any>{
    return this.http.get<any>(this.url_trabajador,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  /* Transferencia de Trabajador */
  transferirTrabajador(id:any,payload:any):Observable<any> {
    return this.http.put<any>(this.url_transfer + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  buscarClues(payload):Observable<any>{
    return this.http.get<any>(this.url_clues_catalogo,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  setTramite(tipo, trabajador):Observable<any>{
    return this.http.post<any>(this.url_tramite, {params:{tipo_tramite: tipo, trabajador:trabajador}}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };
  /*Fin transferencia */
  getTramites(trabajador):Observable<any> {
    return this.http.get<any>(this.url_tramite_trabajador+"/"+trabajador, {}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  createFileComision(id):Observable<any> {
    return this.http.get<any>(this.url_tramite + "/"+id , {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
