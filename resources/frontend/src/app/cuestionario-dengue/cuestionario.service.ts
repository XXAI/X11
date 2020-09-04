import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {

  url = `${environment.base_url}/save-participante`;
  url_cuestionario = `${environment.base_url}/save-cuestionario`;
  url_verificar_cuestionario = `${environment.base_url}/verificar-cuestionario`;

  constructor(private http: HttpClient) { }

  guardarParticipante(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  
  guardarParticipanteCuestionario(payload) {
    return this.http.post<any>(this.url_cuestionario,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  
  

  ver_cuestionario(payload):Observable<any> {
    return this.http.get<any>(this.url_verificar_cuestionario, {params: payload}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }
}
