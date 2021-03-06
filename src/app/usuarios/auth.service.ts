import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable()
export class AuthService {

  private _usuario:Usuario;
  private _token:string;

  constructor(private http:HttpClient) { }
   
  public get usuario(){
    if(this._usuario!=null){
      return {...this._usuario}; 
    }else if((this._usuario==null) && localStorage.getItem('usuario') !=null){
      this._usuario= JSON.parse(localStorage.getItem('usuario') )as Usuario;
      
      return {...this._usuario};
    }else{
      return new Usuario();
    }

  }
  get token():string{
    if(this._token!=null){
      return this._token;
    }else if(this._token==null && localStorage.getItem('token') !=null){
      this._token= localStorage.getItem('token') ;
      return  this._token;
    }else{
      return null;
    }
  }

  login(usuario:Usuario):Observable<any>{
   
    const urlEndpoint = 'http://localhost:8080/oauth/token'; 
    const credentials = btoa('angularApp'+':'+'12345');
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
                      'Authorization':'Basic '+credentials});
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password);  
    
    return this.http.post(urlEndpoint,params.toString(),{headers:httpHeaders})
  }

  guardarUsuario(accessToken:string){
    let payload=this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;

    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));
    localStorage.setItem('usuario',JSON.stringify(this._usuario));
    
  }
  guardarToken(accessToken:string){
    this._token = accessToken;
    sessionStorage.setItem('token',this._token);
    localStorage.setItem('token',this._token);
  }

  obtenerDatosToken(accessToken:string):any{
    if(accessToken!=null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
  }

  isAuthenticated():boolean{  
    let payload = this.obtenerDatosToken(this.token);
    if(payload && payload !=null && payload.user_name && payload.user_name.length>0){
      return true; 
    }
    return false; 
  }

  hasRole(role:string):boolean{
    if(this.usuario.roles.includes(role)){
      return true; 
    }
    return false; 
  }

  logout(){
    this._token=null;
    this._usuario=null; 
    localStorage.clear();
    sessionStorage.clear();
    
  }
}
