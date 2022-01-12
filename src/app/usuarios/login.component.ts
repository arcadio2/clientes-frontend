import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AuthService]
})
export class LoginComponent implements OnInit {

  titulo:string = 'INICIAR SESIÓN';
  usuario:Usuario;

  constructor(private auth:AuthService,private router:Router) {
    this.usuario = new Usuario();
  } 

  ngOnInit() {
    if(this.auth.isAuthenticated()){
      this.router.navigateByUrl('/clientes');
    }else{
      console.log("no carnal")
    }
  }
  login(){
    if(this.usuario.username==null || this.usuario.password==null) {
      Swal.fire('Error','Debes rellenar todos los campos','error');
      return;
    }
    this.auth.login(this.usuario).subscribe(response=>{
      
      this.auth.guardarUsuario(response.access_token);
      
      this.auth.guardarToken(response.access_token); 
      //localStorage.setItem('')
      let usuario = this.auth.usuario;  
      this.router.navigateByUrl('/clientes');
      Swal.fire('Login',`Hola ${usuario.nombre}`,'success');
    },err=>{
      console.log(err)

      if(err.status==400){
        Swal.fire('Login','Usuario o clave incorrecta','error');
      }
      
    })
  }

}
