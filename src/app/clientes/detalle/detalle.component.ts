import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
const Swal = require('sweetalert2');
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { Factura } from '../../facturas/models/factura';
import { FacturasService } from '../../facturas/services/facturas.service';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente:Cliente;
  titulo:string ="Detalle Cliente";
  private progreso:number=0; 
  
  private abierta:boolean = false; 
  private fotoSeleccionada:File; 
  constructor(public clienteService:ClienteService, public auth:AuthService,
            private activatedRoute:ActivatedRoute,
            private facturaService:FacturasService,
            public modalService:ModalService) { }

  ngOnInit() {
      
  /*    this.activatedRoute.paramMap.subscribe(params=>{
      let id:number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente=>{
          this.cliente = cliente; 
        })
      } 
    }) */
  }
  selectFoto(e){
    this.fotoSeleccionada= e.target.files[0];
    this.progreso = 0 ;
    if(this.fotoSeleccionada.type.indexOf('image')<0){
      Swal.fire('ERROR','Debe seleccionar una foto válida','error');
      this.fotoSeleccionada = null;
    } 
    
  }
  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('ERROR','Debe seleccionar una foto','error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(event=>{
        //this.cliente = cliente;
        if(event.type===HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type===HttpEventType.Response){
          let response:any =event.body;
          console.log(response)
          this.cliente = response.cliente as Cliente; 

          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('La foto se ha subido','La foto se ha subido correctamente','success');
        }
        
      })
    }
    
  }
  cerrarModal(){
    this.fotoSeleccionada = null;
    this.progreso = 0;
    this.abierta = false; 
    console.log("xd")
    this.modalService.cerrarModal();
  }
  delete(factura:Factura){
    Swal.fire({
      title: 'Estás seguro?',
      text: `Seguro que quieres eliminar la factura ${factura.descripcion} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(response=>{
          this.cliente.facturas = this.cliente.facturas.filter(f=>f!==factura);
          //this.router.navigateByUrl('/clientes'); 
          Swal.fire(
            'Factura Eliminada!',
            'Eliminado con éxito.',
            'success'
          )
        })
        
      }
    })
   
  }

}
