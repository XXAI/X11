import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  url           = `${environment.base_url}/tramites`;
  url_documentacion = `${environment.base_url}/tramite-documentacion`;
  url_documentacion_upload = `${environment.base_url}/tramite-documentacion-upload`;
  url_documentacion_download = `${environment.base_url}/tramite-documentacion-download`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_expediente = `${environment.base_url}/tramite-documentacion-download`;

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
  setCambioEstatus(id, estatus, data:any= []):Observable<any> {
    return this.http.put<any>(this.url_documentacion+"/"+id, { estatus:estatus, observacion: data.observacion, requerimientos:data.requerimiento}).pipe(
        map( response => {
          return response;
        })
    );
  }
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

  private httpOptions = { headers: new HttpHeaders()};
  setUploadFile(payload):Observable<any> {
    return this.http.post<any>(this.url_documentacion_upload, payload, this.httpOptions).pipe(
      map( response => {
        return response;
      })
    );
  }
  subir(formData: any):Observable<any> {
		return this.http.post(this.url_documentacion_upload, formData);
  }

  getFile(id:any):Observable<any>{
    return this.http.get<any>(this.url_documentacion_download+"/"+id, {responseType: 'blob' as 'json'});
  }

  getExpediente(id):Observable<any> {
    
    return this.http.get<any>(this.url_expediente+"/"+id, {params:{}, responseType: 'blob' as 'json'}).pipe(
      map( response => {
        return response;
      })
    );
    
  }
  /*Fin documentacion */
}
