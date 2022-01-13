import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth:AuthService, private router:Router){}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.isAuthenticated()){
      return true; 
    }
    
    this.router.navigate(['/login']);
    //this.router.navigateByUrl('/login');
    return false;
  }

}
