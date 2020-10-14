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
  url_catalogos = `${environment.base_url}/catalogo-trabajador`;
  url_buscador = `${environment.base_url}/buscador-datos-trabajador`;

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
  
}
