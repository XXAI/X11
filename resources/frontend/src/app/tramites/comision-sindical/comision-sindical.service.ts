import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComisionSindicalService {

  url                     = `${environment.base_url}/comision-interna-sindical`;
  url_buscador            = `${environment.base_url}/buscador-datos-trabajador`;
  url_buscador_trabajador = `${environment.base_url}/busqueda-trabajadores`;
  constructor(private http: HttpClient) { }

  getListPrincipal(payload):Observable<any> { 
    return this.http.get<any>(this.url, {params: payload}).pipe(
        map( response => {
          return response;
        })
    );
  }

  getTrabajador(payload):Observable<any> { 
    return this.http.get<any>(this.url_buscador_trabajador, {params: payload}).pipe(
        map( response => {
          return response;
        })
    );
  }

  guardar(payload: any):Observable<any> {
		return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  eliminar(id, params:any):Observable<any> {
    return this.http.delete<any>(this.url+"/"+id,params).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  buscar(payload):Observable<any>{
    return this.http.get<any>(this.url_buscador,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };
}
