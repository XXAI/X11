import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GerencialService {

  url                       = `${environment.base_url}/tramite-comision-gerencial`;
  url_lote                  = `${environment.base_url}/tramite-comision-gerencial-lote`;
  url_filter_catalogs       =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_filter_trabajador     =  `${environment.base_url}/busqueda-trabajador-tramite`;
  url_busqueda_comision     =  `${environment.base_url}/busqueda-trabajador-tramites`;
  url_importar_informacion  =  `${environment.base_url}/importar_csv_data`;
  url_validar_informacion   =  `${environment.base_url}/validar-importacion`;
  url_migrar_informacion    =  `${environment.base_url}/migrar-importacion`;
  url_truncar_informacion    =  `${environment.base_url}/truncar-comision-gerencial`;
  url_validacion_comision   =  `${environment.base_url}/verificar-comision`;
  
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
  
  buscarTrabajadorComision(payload):Observable<any> {
      
      return this.http.get<any>(this.url_busqueda_comision, {params: payload}).pipe(
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
    payload.per_page = 50;
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

  cargaArchivo(payload:any)
  {
    return this.http.post<any>(this.url_importar_informacion , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  validarComisiones(payload:any)
  {
    return this.http.post<any>(this.url_validar_informacion , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  importarComisiones(payload:any)
  {
    return this.http.post<any>(this.url_migrar_informacion , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  
  eliminarComision(id, payload:any)
  {
    return this.http.delete<any>(this.url+"/"+id , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  truncarComision(payload:any)
  {
    return this.http.post<any>(this.url_truncar_informacion , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  verificarRegistroComision(id:any)
  {
    return this.http.get<any>(this.url_validacion_comision+"/"+id , {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
