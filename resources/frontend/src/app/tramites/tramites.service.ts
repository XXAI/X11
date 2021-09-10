import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  url           = `${environment.base_url}/tramites`;
  url_documentacion = `${environment.base_url}/tramite-documentacion`;
  url_documentacion_upload = `${environment.base_url}/tramite-documentacion-upload`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;

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

  setTramiteEstatus(id, tipo, estado):Observable<any> {
    return this.http.put<any>(this.url + "/" + id, {tipo_comision: tipo, estatus:estado}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  createFileComision(id):Observable<any> {
    return this.http.get<any>(this.url + "/"+id , {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  /*Documentacion */
  getTramitesDocumentacionList(payload):Observable<any> {
    return this.http.get<any>(this.url_documentacion, {params: payload}).pipe(
        map( response => {
          return response;
        })
    );
  }

  getFilterCatalogs():Observable<any>{
    return this.http.get<any>(this.url_filter_catalogs).pipe(
      map(response => {
        return response;
      })
    );
  }

  private httpOptions = { headers: new HttpHeaders({'Access-Control-Allow-Origin':'*', Accept: 'application/json' })};
  setUploadFile(payload):Observable<any> {
    return this.http.post<any>(this.url_documentacion_upload, payload, this.httpOptions).pipe(
      map( response => {
        return response;
      })
    );
  }
  subir(formData: FormData, ):Observable<any> {
		return this.http.post(this.url_documentacion_upload, formData);
  }
  /*Fin documentacion */
}
