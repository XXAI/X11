import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdscripcionService {

  url           = `${environment.base_url}/tramite-adscripcion`;
  url_lote      = `${environment.base_url}/tramite-adscripcion-lote`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_filter_trabajador =  `${environment.base_url}/busqueda-trabajador-tramite`;
  url_migrar_informacion    =  `${environment.base_url}/migrar-importacion`;
  url_importar_informacion  =  `${environment.base_url}/importar_csv_data`;

  url_validar_informacion   =  `${environment.base_url}/validar-importacion`;

  url_busqueda_trabajador_tramite     =  `${environment.base_url}/busqueda-trabajador-tramites`;
  
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
  eliminarCambioAdscripcion(id:any = null, payload:any)
  {
    return this.http.delete<any>(this.url + "/"+id , {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  guardarAdscripcion(payload:any)
  {
    return this.http.post<any>(this.url , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  editarAdscripcion(id:number, payload:any)
  {
    return this.http.put<any>(this.url+"/"+id , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  
  getTrabajador( payload:any)
  {
    return this.http.get<any>(this.url_filter_trabajador , {params:payload}).pipe(
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
  
  cargaArchivo(payload:any)
  {
    return this.http.post<any>(this.url_importar_informacion ,  payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  validarImportacion(payload:any)
  {
    return this.http.post<any>(this.url_validar_informacion , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  importar(payload:any)
  {
    return this.http.post<any>(this.url_migrar_informacion , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  buscarTrabajadorAdscripcion(payload):Observable<any> {
      
    return this.http.get<any>(this.url_busqueda_trabajador_tramite, {params: payload}).pipe(
        map( response => {
          return response;
        })
    );
}

}
