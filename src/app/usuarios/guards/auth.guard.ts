import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth:AuthService, private router:Router){}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.isAuthenticated()){
      if(this.isTokenExpirado()){
        this.auth.logout(); 
        this.router.navigateByUrl('/login'); 
        return false; 
      }
      return true; 
    }
    
    this.router.navigate(['/login']);
    //this.router.navigateByUrl('/login');
    return false;
  }

  isTokenExpirado():boolean{
    let token = this.auth.token;
    let payload = this.auth.obtenerDatosToken(token);
    let now = new Date().getTime()/1000;
    if(payload.exp<now){
      return true; 
    }
    return false; 
  }

}
