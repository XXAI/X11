import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SaludService {

  private api: string
  private http_upload: HttpClient;
  url           = `${environment.base_url}/credencializacion`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;
  url_imprimir_lote =  `${environment.base_url}/credencializacion-lote`;
  url_catalogos = `${environment.base_url}/catalogos`;
  url_cargos    = `${environment.base_url}/catalogo_cargos`;

  constructor( handler: HttpBackend, private http: HttpClient) {
    //To ignore interceptor
    this.http_upload = new HttpClient(handler);
    this.api = environment.base_url;
    
  }

  getCatalogos():Observable<any> {
    return this.http.get<any>(this.url_catalogos, {}).pipe(
        map( response => {
          return response;
        })
    );
  }

  getCargos(payload:any):Observable<any> {
    return this.http.get<any>(this.url_cargos, {params:payload}).pipe(
        map( response => {
          return response;
        })
    );
  }

  getTrabajadorList(payload):Observable<any> {
      if(payload.reporte && payload.export_excel){
        console.log("entro");
          return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
      }else{
        return this.http.get<any>(this.url, {params: payload}).pipe(
            map( response => {
              return response;
            })
        );
      }
  }

  buscarCredencial(id:any, payload:any):Observable<any>{
    return this.http.get<any>(this.url + "/" + id, {params:payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };

  imprimirLoteCredencial(id:any = null, payload:any){
    payload.page = id;
    payload.per_page = 100;
    return this.http.get<any>(this.url_imprimir_lote, {params: payload}).pipe(
    //return this.http.get<any>(this.url_imprimir_lote, {params:payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  };

  saveCredencial(id:any, payload:any):Observable<any> {
    return this.http.put<any>(this.url + "/" + id, payload).pipe(
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

  upload(data:any,file:File,path:string): Observable<any>{
    const formData: FormData = new FormData();

    formData.append('archivo', file, file.name);

    formData.append('trabajador_id', data.trabajador_id);

    //let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set(
      "Authorization",'Bearer '+localStorage.getItem("token"),
    );
    headers.append('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Access-Control-Allow-Origin','*');
    return this.http_upload.post(this.url, formData, { headers:headers});
    
  }
}
