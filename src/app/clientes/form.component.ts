import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Cliente, ClienteErrors } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  titulo:string='Crear Cliente';

  private cliente: Cliente = new Cliente();
  private errors:ClienteErrors=new ClienteErrors();


  constructor(private clienteService:ClienteService, private router:Router, 
            private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(){
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=>{
         
          this.cliente=cliente
        });
      }
    })
  }

  create():void{
    console.log("Clicked!"); 
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(response=>{
     // console.log(response)
      this.router.navigateByUrl('/clientes');
      swal.fire('Nuevo cliente ',`Usuario ${response.nombre} Creado`,'success');
    },(err)=>{
      this.errors = err.error.errors as ClienteErrors;
    }
    );
  }

  update(){
    this.clienteService.update(this.cliente).subscribe(response=>{
      this.router.navigateByUrl('/clientes');
      swal.fire('Cliente ',"Usuario "+ response.cliente.nombre+" Actualizado!",'success');
    },(err)=>{
      this.errors = err.error.errors as ClienteErrors;
    }
    );
  }


}
