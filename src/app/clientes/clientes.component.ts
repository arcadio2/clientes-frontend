import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

const Swal = require('sweetalert2');
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { PaginatorCliente } from './pageable.models';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';
  
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
 
  clientes: Cliente[];  
  clienteSeleccionado:Cliente;
  paginator:PaginatorCliente;
  page:number=0;

  constructor(private clienteService: ClienteService, public auth:AuthService,
              private router:Router, public modalService:ModalService) { }

  ngOnInit() {
    this.cargarClientes();
    
    /**Se ejecuta cada que se emite */
    this.modalService.notificarUpload.subscribe(cliente=>{

      this.clientes = this.clientes.map(clienteOriginal=>{
        if(cliente.id==clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }

  delete(cliente:Cliente){
    Swal.fire({
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
          Swal.fire(
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
        
      })
    ).subscribe();
  }

  change(e:number){
    this.page=e; 
    this.cargarClientes();
  }
  openModal(cliente:Cliente){
    this.clienteSeleccionado=cliente;
    //console.log(this.modalService.modal)
    this.cargarClientes();
    this.modalService.abrirModal();
     
    
  } 


} 
