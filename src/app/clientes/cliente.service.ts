import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente, SuccesCliente } from './cliente';
import { Observable } from 'rxjs/Observable';
import {_throw} from 'rxjs/observable/throw' ;
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map,catchError,tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PaginatorCliente } from './pageable.models';
import { Region } from './region';


@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});


  constructor(private http: HttpClient, private router:Router) { }

  private isNotAuthorized(e):boolean{
    if(e.status == 401 || e.status == 403){
      this.router.navigateByUrl('/login');
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
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
    
      catchError(e=>{
        if(this.isNotAuthorized(e)){
          return _throw(e);
        }
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
        if(this.isNotAuthorized(e)){
          return _throw(e);
        }
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
        if(this.isNotAuthorized(e)){
          return _throw(e);
        }
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
        if(this.isNotAuthorized(e)){
          return _throw(e);
        }
        swal.fire("Error al Eliminar",e.error.mensaje,'error');
        return _throw(e)
      })
    )
  }

  subirFoto(archivo:File, id):Observable<HttpEvent<{}>>{
    //creamos un formulario desde aqui
    let data:FormData  = new FormData();
    data.append("file",archivo); //nombre en el backend
    data.append("id",id); 
    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,data, {
      reportProgress: true
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
