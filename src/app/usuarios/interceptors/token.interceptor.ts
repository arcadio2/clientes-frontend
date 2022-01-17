import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
@Injectable()
export class tokenInterceptor implements HttpInterceptor {

  constructor(private aut:AuthService){}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.aut.token;
    if (!token) {
        return next.handle(req);
    }
    const headers = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    return next.handle(headers);
    }
}