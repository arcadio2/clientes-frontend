import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { PaginatorCliente } from './pageable.models';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[]; 
  paginator:PaginatorCliente;
  page:number=0;

  constructor(private clienteService: ClienteService, private router:Router) { }

  ngOnInit() {
    this.cargarClientes();
  }

  delete(cliente:Cliente){
    swal.fire({
      title: 'Estás seguro?',
      text: `Seguro que quieres eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(response=>{
          this.clientes = this.clientes.filter(cli=>cli!==cliente);
          //this.router.navigateByUrl('/clientes'); 
          swal.fire(
            'Cliente Eliminado!',
            'Your file has been deleted.',
            'success'
          )
        })
        
      }
    })
  }


  cargarClientes(){
    this.clienteService.getClientesPage(this.page).pipe(
      tap(paginador=>{
        this.paginator = paginador; 
        this.clientes = paginador.content;
        //alert(clientes)
      })
    ).subscribe();
  }

  change(e:number){
    this.page=e; 
    this.cargarClientes();
  }

}
