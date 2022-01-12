import { Component } from '@angular/core';
import { Usuario } from '../usuarios/usuario';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers:[AuthService]
})
export class HeaderComponent {
  title: string = 'App Angular'
  usuario:Usuario=undefined;

  constructor(private auth:AuthService,private router:Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.auth.isAuthenticated()){
      this.usuario = this.auth.usuario;
    }
  } 
}
