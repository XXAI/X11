import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  url           = `${environment.base_url}/register`;

  constructor(private http: HttpClient) { }

  registroTrabajador(username: string, password: string) {
    return this.http.post<any>(this.url, { 'rfc':username, 'contrasenia':password}).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
