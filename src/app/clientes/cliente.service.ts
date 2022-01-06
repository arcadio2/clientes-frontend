import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente, SuccesCliente } from './cliente';
import { Observable } from 'rxjs/Observable';
import {_throw} from 'rxjs/observable/throw' ;
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map,catchError,tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});


  constructor(private http: HttpClient, private router:Router) { }

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
  getCliente(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
    
      catchError(e=>{
        this.router.navigateByUrl('/clientes');
        swal.fire("Error al cargar",e.error.mensaje,'error');
        return _throw(e);
      }) 
    )
  }



  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
      map( (response:any)=>{

        return response.cliente as Cliente; 
      }),
      catchError(e=>{
        if(e.status==400){
          return _throw(e);
        }
        swal.fire("Error al Crear",e.error.mensaje,'error');
        return _throw(e)
      })
    )
  }

  update(cliente:Cliente):Observable<SuccesCliente>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
      catchError(e=>{
        if(e.status==400){
          console.log(e)
          return _throw(e);
        }
        swal.fire("Error al Editar",e.error.mensaje,'error');
        return _throw(e)
      })
    )
  }

  delete(id:number):Observable<any>{
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError(e=>{
        swal.fire("Error al Eliminar",e.error.mensaje,'error');
        return _throw(e)
      })
    )
  }

}
