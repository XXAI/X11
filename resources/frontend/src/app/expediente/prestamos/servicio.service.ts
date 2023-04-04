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
  url           = `${environment.base_url}/expediente`;
  url_devolver  = `${environment.base_url}/devolver-expediente`;
  
  constructor( handler: HttpBackend, private http: HttpClient) {
    //To ignore interceptor
    this.http_upload = new HttpClient(handler);
    this.api = environment.base_url;
    
  }

  getTrabajadorList(payload):Observable<any> {
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


  guardarPrestamo(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  editarPrestamo(id, payload) {
    return this.http.put<any>(this.url+"/"+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  devolverPrestamo(id, payload) {
    return this.http.put<any>(this.url_devolver+"/"+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
