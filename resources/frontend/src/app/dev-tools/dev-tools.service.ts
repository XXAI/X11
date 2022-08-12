import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DevToolsService {
  url                       = `${environment.base_url}/tramite-comision`;
  url_base                  = `${environment.base_url}/cargar-base`;

  constructor(private http: HttpClient) { }

  cargarBase()
  {
    return this.http.post<any>(this.url_base , {}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  importarDB(payload:any)
  {
    return this.http.post<any>(this.url , {params: payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
