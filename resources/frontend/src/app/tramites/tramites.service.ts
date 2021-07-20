import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  url           = `${environment.base_url}/tramites`;

  constructor(private http: HttpClient) { }

  getTramitesList(payload):Observable<any> {
      if(payload.reporte && payload.export_excel){
          return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
      }
      return this.http.get<any>(this.url, {params: payload}).pipe(
          map( response => {
            return response;
          })
      );
  }

  /*getFirmantesList():Observable<any> {
    return this.http.get<any>(this.url_firmantes,{}).pipe(
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

  
  buscarTrabajadores(payload):Observable<any>{
    return this.http.get<any>(this.url_trabajadores,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  getCatalogoSindicato():Observable<any> {
    return this.http.get<any>(this.url_catalogos, {}).pipe(
        map( response => {
          return response;
        })
    );
  }

  bajaTrabajador(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url_baja + "/" + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  guardarNuevoTrabajador(payload:any):Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
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
  
  getDatosAsistencia(payload):Observable<any> {
    return this.http.get<any>(this.url_asistencia, {params: payload}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  buscarCr(payload):Observable<any>{
    return this.http.get<any>(this.url_cr,{params:payload}).pipe(
      map( response => {
        console.log(response);
        return response.data;
      })
    );
  };

  activarTrabajador(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url_activacion + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  validarTrabajador(id:any):Observable<any> {
    return this.http.put<any>(this.url_validacion + id, {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  agregarFirmante(payload) {
    return this.http.post<any>(this.url_firmantes,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  deleteFirmante(id){
    return this.http.delete<any>(this.url_firmantes+'/'+id,{}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  buscarResponsable(payload):Observable<any>{
    return this.http.get<any>(this.url_trabajador,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  transferirTrabajador(id:any,payload:any):Observable<any> {
    return this.http.put<any>(this.url_transfer + id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  buscarClues(payload):Observable<any>{
    return this.http.get<any>(this.url_clues_catalogo,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };*/
}
