import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DirectorioService {

  url           = `${environment.base_url}/directorio`;
  url_responsable = `${environment.base_url}/responsable-unidad`;
  url_trabajador           = `${environment.base_url}/directorio-trabajador`;

  constructor(private http: HttpClient) { }

  getDirectorioList(payload):Observable<any> {
      if(payload.reporte && payload.export_excel){
          return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
      }
      return this.http.get<any>(this.url, {params: payload}).pipe(
          map( response => {
            return response;
          })
      );
  }

  getDirectorio(id:any, payload:any):Observable<any>{
    return this.http.get<any>(this.url + "/" + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };
  
  buscarTrabajador(payload):Observable<any>{
    
    return this.http.get<any>(this.url_trabajador, {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };

  guardarDirectorio(payload:any):Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  guardarResponsable(payload:any):Observable<any> {
    return this.http.post<any>(this.url_responsable, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  
  eliminarResponsable(id, params:any):Observable<any> {
    return this.http.delete<any>(this.url+"/"+id,params).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }
  
}
