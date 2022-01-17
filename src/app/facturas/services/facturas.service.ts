import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';
import { AuthService } from '../../usuarios/auth.service';

@Injectable()
export class FacturasService {

  constructor(private http:HttpClient, public auth:AuthService) { }

  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});
  private addAuthorizationHeader(){
    let token = this.auth.token; 
    console.log(token)
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer '+token)
    }
    return this.httpHeaders;
  }

  private urlEndpoint: string = 'http://localhost:8080/api/facturas'; 

  getFactura(id:number):Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndpoint}/${id}`,{headers:this.addAuthorizationHeader()});
  }

  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.urlEndpoint}/${id}`,{headers:this.addAuthorizationHeader()});
  }

  getProductos(term:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndpoint}/filtrar-productos/${term}`,{headers:this.addAuthorizationHeader()});
  }
  create(factura:Factura):Observable<Factura>{
    return this.http.post<Factura>(this.urlEndpoint,factura,{headers:this.addAuthorizationHeader()});
  }
}
