import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportarService {

  private api: string
  private http: HttpClient;
  url_documentacion_upload = `${environment.base_url}/tramite-documentacion-upload`;

  constructor( handler: HttpBackend) {
    //To ignore interceptor
    this.http = new HttpClient(handler);
    this.api = environment.base_url;
  }

  /*catalogos(): Observable<any>{  
    let token = localStorage.getItem('token');   
    return this.http.get(`${this.api}/almacen-existencias/catalogos/?token=${token}`);
  }*/

  upload(data:any,file:File,path:string): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('archivo', file, file.name);

    formData.append('trabajador_id', data.trabajador_id);
    formData.append('rfc', data.rfc);
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set(
      "Authorization",'Bearer '+localStorage.getItem("token"),
    );
    headers.append('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Access-Control-Allow-Origin','*');
    return this.http.post(this.url_documentacion_upload, formData, { headers:headers});
    
  }
}