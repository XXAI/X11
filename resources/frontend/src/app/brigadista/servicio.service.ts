import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  url           = `${environment.base_url}/brigadista`;
  url_subproceso= `${environment.base_url}/sub_proceso_brigadista`;

  constructor(private http: HttpClient) { }

  getListado(payload):Observable<any> {
      if(payload.reporte && payload.export_excel){
          return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
      }
      return this.http.get<any>(this.url, {params: payload}).pipe(
          map( response => {
            return response;
          })
      );
  }
  
  verBrigadista(id, payload):Observable<any>{
    
    return this.http.get<any>(this.url+"/"+id, {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };


  guardarBrigadista(payload:any):Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  
  editarBrigadista(id, payload:any):Observable<any> {
    return this.http.put<any>(this.url+"/"+id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  
  eliminarBrigadista(id, params:any):Observable<any> {
    return this.http.delete<any>(this.url+"/"+id,params).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  guardarsubProceso(payload:any):Observable<any> {
    return this.http.post<any>(this.url_subproceso, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  editarsubProceso(id, payload:any):Observable<any> {
    return this.http.put<any>(this.url_subproceso+"/"+id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  ListarSubProceso(payload:any):Observable<any> {
    return this.http.get<any>(this.url_subproceso, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verSubBrigadista(id):Observable<any> {
    return this.http.get<any>(this.url_subproceso + "/" + id, {}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
