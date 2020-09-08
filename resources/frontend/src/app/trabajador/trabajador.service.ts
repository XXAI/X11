import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  url = `${environment.base_url}/trabajador`;

  constructor(private http: HttpClient) { }

  getTrabajadorList(payload):Observable<any> {
    if(payload.reporte && payload.export_excel){
      return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
    }
    return this.http.get<any>(this.url, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
