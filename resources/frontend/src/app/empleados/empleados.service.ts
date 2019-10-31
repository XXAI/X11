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
  url_catalogos = `${environment.base_url}/catalogos`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_credencial = 'http://credencializacion.saludchiapas.gob.mx/ConsultaRhPersonal.php?buscar=';
  /*url_role = `${environment.base_url}/role`;
  url_permission = `${environment.base_url}/permission`;
  url_avatars = `${environment.base_url}/avatar-images`;*/

  constructor(private http: HttpClient) { }

  getEmpleadosList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  desligarEmpleado(id:any):Observable<any> {
    return this.http.get<any>(this.url +"/"+ id, {}).pipe(
      map( (response: any) => {        
        return response.data;
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
}
