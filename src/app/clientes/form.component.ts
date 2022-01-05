import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  titulo:string='Crear Cliente';

  private cliente: Cliente = new Cliente();

  constructor(private clienteService:ClienteService, private router:Router) { }

  ngOnInit() {
  }

create():void{
  console.log("Clicked!"); 
  console.log(this.cliente);
  this.clienteService.create(this.cliente).subscribe(response=>{
  
    this.router.navigateByUrl('/clientes');
    swal.fire('Nuevo cliente ',"Usuario "+ response.nombre+" Creado",'success');
  })
}

}
