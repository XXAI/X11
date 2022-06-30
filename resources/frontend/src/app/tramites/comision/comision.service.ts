import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComisionService {

  url           = `${environment.base_url}/tramite-comision`;
  url_lote      = `${environment.base_url}/tramite-comision-lote`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_filter_trabajador =  `${environment.base_url}/busqueda-trabajador-tramite`;
  
  constructor(private http: HttpClient) { }

  getListPrincipal(payload):Observable<any> {
      /*if(payload.reporte && payload.export_excel){
          return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
      }*/
      return this.http.get<any>(this.url, {params: payload}).pipe(
          map( response => {
            return response;
          })
      );
  }

  buscarTrabajador(id:any = null, payload:any)
  {
    return this.http.get<any>(this.url + "/"+id , {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  imprimirLoteAdscripcion(id:any = null, payload:any)
  {
    payload.page = id;
    payload.per_page = 100;
    return this.http.get<any>(this.url_lote, {params: payload}).pipe(
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

  getTrabajador( payload:any)
  {
    return this.http.get<any>(this.url_filter_trabajador , {params:payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  guardarComision(payload:any)
  {
    return this.http.post<any>(this.url , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  editarComision(id:number, payload:any)
  {
    return this.http.put<any>(this.url+"/"+id , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
