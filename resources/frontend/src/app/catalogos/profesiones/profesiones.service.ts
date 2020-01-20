import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfesionesService {

  url = `${environment.base_url}/profesiones`;
  url_cat_tipo_profesion = `${environment.base_url}/catalogo-tipo-profesion`;
  
  constructor(private http: HttpClient) { }

  obtenerListaProfesiones(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verDatosProfesion(id:any):Observable<any> {
    return this.http.get<any>(this.url+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  actualizarProfesion(id:any, form:any):Observable<any> {
    return this.http.put<any>(this.url +"/"+ id, form).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  crearProfesion(form:any):Observable<any> {
    return this.http.post<any>(this.url, form).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  eliminarProfesion(id:any):Observable<any> {
    return this.http.delete<any>(this.url +"/"+ id).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  obtenerCatalogoTipoProfesion():Observable<any>{
    return this.http.get<any>(this.url_cat_tipo_profesion).pipe(
      map( response => {
        return response;
      })
    );
  }
}
