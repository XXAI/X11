import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private api: string
  private http_upload: HttpClient;
  url           = `${environment.base_url}/opd`;
  url_imprimir_lote =  `${environment.base_url}/opd-lote`;
  url_impreso    = `${environment.base_url}/registro_impreso_anexo`;

  constructor( handler: HttpBackend, private http: HttpClient) {
    this.http_upload = new HttpClient(handler);
    this.api = environment.base_url;
    
  }

  getList(payload):Observable<any> {
    if(payload.reporte && payload.export_excel){
      //console.log("entro");
        return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
    }else{
      return this.http.get<any>(this.url, {params: payload}).pipe(
          map( response => {
            return response;
          })
      );
    }
}

RegistroImpresionAnexos(id:any, payload:any):Observable<any> {
  return this.http.put<any>(this.url_impreso + "/" + id, payload).pipe(
    map( (response: any) => {        
      return response;
    }
  ));
}

  buscarRegistro(id:any, payload:any):Observable<any>{
    return this.http.get<any>(this.url + "/" + id, {params:payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };

  imprimirLote(id:any = null, payload:any){
    payload.page = id;
    payload.per_page = 100;
    return this.http.get<any>(this.url_imprimir_lote, {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };
}
