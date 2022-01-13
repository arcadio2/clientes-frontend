import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private auth:AuthService, private router:Router){

  }

  canActivate(next:ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let role = next.data['role'] as string; 
    if(!this.auth.isAuthenticated()){
        this.router.navigateByUrl('/login');
        return false; 
    }
    if(this.auth.hasRole(role)){
      return true; 
    }
    Swal.fire('Acceso denegado','No tienes permiso para acceder aqui','warning')
    this.router.navigateByUrl('/clientes');
    return false;
  }
}
