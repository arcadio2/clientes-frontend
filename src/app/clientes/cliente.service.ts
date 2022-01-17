import { Injectable, Component } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente, SuccesCliente } from './cliente';
import { Observable } from 'rxjs/Observable';
import {_throw} from 'rxjs/observable/throw' ;
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map,catchError,tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { PaginatorCliente } from './pageable.models';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';
const Swal = require('sweetalert2');


@Injectable(
  
)

export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'}); //es inmutable


  constructor(private http: HttpClient, private router:Router, public auth:AuthService) { }

  private addAuthorizationHeader(){
    let token = this.auth.token; 
    console.log(token)
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer '+token)
    }
    return this.httpHeaders;
  }


  private isNotAuthorized(e):boolean{
    if(e.status == 401 ){
      if(this.auth.isAuthenticated()){
        this.auth.logout();
      }
      this.router.navigateByUrl('/login');
      return true; 
    }
    if( e.status == 403){
      Swal.fire('Acceso denegado','No tienes acceso a este recurso','warning');
      this.router.navigateByUrl('/clientes');
      return true; 
    }
    return false;
  }


  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones').pipe(
      catchError(e=>{
        this.isNotAuthorized(e);
        return _throw(e);
      })
    )
  }


  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      tap(response=>{
        let clientes = response as Cliente[];
        clientes.forEach(cliente=>{
          //HACER ALGO, no modifica el tipo de dato
        })
      }),
      map(response=>{
        //alert("XDD")
        return response as Cliente[];
      }),
      
    );
  }
  getClientesPage(page:number): Observable<PaginatorCliente>{
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      map((response:any)=>{
        return response as PaginatorCliente;
      })
    )
  }


  getCliente(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.addAuthorizationHeader()} ).pipe(
    
      catchError(e=>{
        if(this.isNotAuthorized(e)){
          console.log(e)
          return _throw(e);
        }
        this.router.navigateByUrl('/clientes');
        Swal.fire("Error al cargar",e.error.mensaje,'error');
        return _throw(e);
      }) 
    )
  }



  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers:this.addAuthorizationHeader()}).pipe(
      map( (response:any)=>{

        return response.cliente as Cliente; 
      }),
      catchError(e=>{
        if(this.isNotAuthorized(e)){
          return _throw(e);
        }
        if(e.status==400){
          return _throw(e);
        }
        Swal.fire("Error al Crear",e.error.mensaje,'error');
        return _throw(e)
      })
    )
  }

  update(cliente:Cliente):Observable<SuccesCliente>{
    return this.http.put<SuccesCliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.addAuthorizationHeader()}).pipe(
      tap(resp=>{
        console.log(resp)
      }),
      catchError(e=>{
        console.log("eeror"+e)
        if(this.isNotAuthorized(e)){
          return _throw(e);
        }
        if(e.status==400){
          Swal.fire("Error al Editar","No se ha podido procesar la solicitud",'error');
          return _throw(e);
        }
        Swal.fire("Error al Editar",e.error.mensaje,'error');
        return _throw(e)
      })
    )
  }

  delete(id:number):Observable<any>{
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`,{headers:this.addAuthorizationHeader()}).pipe(
      
      catchError(e=>{
        if(this.isNotAuthorized(e)){
          return _throw(e);
        }
        Swal.fire("Error al Eliminar",e.error.mensaje,'error');
        return _throw(e)
      })
    )
  }

  subirFoto(archivo:File, id):Observable<HttpEvent<{}>>{
    //creamos un formulario desde aqui
    let data:FormData  = new FormData();
    data.append("file",archivo); //nombre en el backend
    data.append("id",id);   
    let httpHeaders = new HttpHeaders();
    let token = this.auth.token;
    if(token!=null){
      httpHeaders = httpHeaders.append('Authorization','Bearer '+token);
    }
    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,data, {
      reportProgress: true,
      headers:httpHeaders
    });
    return this.http.request(req).pipe(
      catchError(e=>{
        this.isNotAuthorized(e);
        return _throw(e);
      })
    );
    /*return this.http.request(req).pipe(
      map((response:any)=>{
        return response.cliente as Cliente; 
      }),
      catchError(e=>{
        console.log(e)
        swal.fire("Error al subir foto ",e.error.mensaje,'error');
        return _throw(e)
      })

    )*/

  }

}
