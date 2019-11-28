import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  url = `${environment.base_url}/empleados`;
  url_transfer = `${environment.base_url}/transferir-empleado/`;
  url_transfer_data = `${environment.base_url}/obtener-datos-transferencia/`;
  url_finish_transfer = `${environment.base_url}/finalizar-transferencia/`;
  url_unlink = `${environment.base_url}/liberar-empleado/`;
  url_activate = `${environment.base_url}/activar-empleado/`;
  url_shut_down = `${environment.base_url}/baja-empleado/`;

  url_catalogos = `${environment.base_url}/catalogos`;
  url_catalogo_tipo_baja =  `${environment.base_url}/catalogo-tipo-baja`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_credencial = 'http://credencializacion.saludchiapas.gob.mx/ConsultaRhPersonal.php?buscar=';

  url_clues_catalogo = `${environment.base_url}/busqueda-clues`;
  url_codigos_catalogo = `${environment.base_url}/busqueda-codigos`;
  url_profesion_catalogo = `${environment.base_url}/busqueda-profesiones`;
  url_cr = `${environment.base_url}/busqueda-cr`;
  url_cr_adscripcion = `${environment.base_url}/busqueda-cr-adscripcion`;
  url_empleados = `${environment.base_url}/busqueda-empleados`;
  
  url_reporte = `${environment.base_url}/reporte-empleados-validados`;

  url_solicitar_transfer = `${environment.base_url}/solicitar-transferencia/`;
  /*url_role = `${environment.base_url}/role`;
  url_permission = `${environment.base_url}/permission`;
  url_avatars = `${environment.base_url}/avatar-images`;*/

  constructor(private http: HttpClient) { }

  buscarClues(payload):Observable<any>{
    return this.http.get<any>(this.url_clues_catalogo,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  buscarCodigo(payload):Observable<any>{
    return this.http.get<any>(this.url_codigos_catalogo,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  buscarProfesion(payload):Observable<any>{
    return this.http.get<any>(this.url_profesion_catalogo,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  buscarCr(payload):Observable<any>{
    return this.http.get<any>(this.url_cr,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  buscarCrAsdcripcion(payload):Observable<any>{
    return this.http.get<any>(this.url_cr_adscripcion,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  getEmpleadosList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  transferirEmpleado(id:any,payload:any):Observable<any> {
    return this.http.put<any>(this.url_transfer + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  obtenerDatosTransferenciaEmpleado(id:any):Observable<any> {
    return this.http.get<any>(this.url_transfer_data+ id, {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  finalizarTransferenciaEmpleado(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url_finish_transfer + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  bajaEmpleado(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url_shut_down + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  obtenerDatosEmpleado(id:any, payload:any):Observable<any> {
    return this.http.get<any>(this.url +"/"+ id, {params:payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  desligarEmpleado(id:any):Observable<any> {
    return this.http.put<any>(this.url_unlink + id, {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  activarEmpleado(id:any):Observable<any> {
    return this.http.put<any>(this.url_activate + id, {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  actualizarEmpleado(id:any, form:any):Observable<any> {
    return this.http.put<any>(this.url +"/"+ id, form).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  guardarEmpleado(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
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

  getCatalogosList(obj_empleado):Observable<any> {
    return this.http.get<any>(this.url_catalogos,{params: {"profesion_id": obj_empleado.profesion_id }}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCatalogos():Observable<any> {
    return this.http.get<any>(this.url_catalogos,{params:{}}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCatalogoTiposBaja():Observable<any> {
    return this.http.get<any>(this.url_catalogo_tipo_baja,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  buscarEmpleados(payload):Observable<any>{
    return this.http.get<any>(this.url_empleados,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  reporteEmpleados():Observable<any>{
    return this.http.get<any>(this.url_reporte,{}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  solicitarTransfer(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url_solicitar_transfer + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
