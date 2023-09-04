import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  url_clasificacion = `${environment.base_url}/catalogo_clasificacion`;
  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-empleados`;

  constructor(private http: HttpClient) { }

  getClasificacion():Observable<any> {
    return this.http.get<any>(this.url_clasificacion,{params: {}}).pipe(
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
}
