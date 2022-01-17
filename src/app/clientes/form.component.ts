import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Cliente, ClienteErrors } from './cliente';
import { ClienteService } from './cliente.service';
const Swal = require('sweetalert2');
import { Observable } from 'rxjs/Observable';
import { Region } from './region';
 
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  titulo:string='Crear Cliente';  

  public cliente: Cliente = new Cliente();
  private regiones:Region[];  
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
          console.log(cliente) 
          this.cliente=cliente
        });
      }
    }) 
    this.clienteService.getRegiones().subscribe((regiones)=>{
      this.regiones = regiones; 
    }) 
  }

  create():void{
    console.log("Clicked!"); 
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(response=>{
     // console.log(response) 
      this.router.navigateByUrl('/clientes');
      Swal.fire('Nuevo cliente ',`Usuario ${response.nombre} Creado`,'success');
    },(err)=>{
      this.errors = err.error.errors as ClienteErrors;
    }
    );
  }

  update(){
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(response=>{
      this.router.navigateByUrl('/clientes');
      Swal.fire('Cliente ',"Usuario "+ response.cliente.nombre+" Actualizado!",'success');
    },(err)=>{
      this.errors = err.error.errors as ClienteErrors;
    }
    );
  }
  compareRegion(o1:Region,o2:Region):boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1===null || o2===null || o1===undefined || o2===undefined? false:o1.id===o2.id;  
  } 

} 
