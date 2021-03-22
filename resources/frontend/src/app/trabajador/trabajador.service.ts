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
  url_catalogos = `${environment.base_url}/catalogo-trabajador`;
  url_buscador = `${environment.base_url}/buscador-datos-trabajador`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;

  url_info_trabajador = `${environment.base_url}/ver-info-trabajador/`;

  url_credencial = 'http://credencializacion.saludchiapas.gob.mx/ConsultaRhPersonal.php?buscar=';

  url_unlink = `${environment.base_url}/liberar-trabajador/`;

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
    return this.http.get<any>(this.url + "/" + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };

  

  getCatalogoSindicato():Observable<any> {
    return this.http.get<any>(this.url_catalogos, {}).pipe(
        map( response => {
          return response;
        })
    );
  }

  bajaTrabajador(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url + "/" + id, payload).pipe(
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

  
}
