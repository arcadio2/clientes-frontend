import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FacturasService } from './services/facturas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operator/startWith';
import { map } from 'rxjs/operator/map';
import { Producto } from './models/producto';
import { ItemFactura } from './models/item-factura';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styles: []
})
export class FacturasComponent implements OnInit {

  @ViewChild('producto') inputProducto:ElementRef;
  titulo="Fromulario factura";
  productos:Producto[]=[]; 

  filteredOptions: Observable<string[]>;
  factura:Factura = new Factura();
  constructor(private facturaService:FacturasService, 
            private clienteService:ClienteService,
            private activatedRoute:ActivatedRoute,
            private router:Router) { }
 
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId:number = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente=>{
        this.factura.cliente = cliente ;
      })
    })
   /*  this.filteredOptions = this.myControl.valueChanges.pipe(
       startWith(''),
      map(value => {this._filter(value)}), 
    ); */
  }



  cambiarProducto(){ 
    let term = this.inputProducto.nativeElement.value;
    this.facturaService.getProductos(term).subscribe(resp=>{
      this.productos = resp;
    })
  }

  agergar(producto:Producto){
    
    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;

    if(this.existeProducto(producto.id)){
      this.incrementarCantidad(producto.id);
    }else{
      nuevoItem.cantidad=1;
      console.log(this.factura)
      this.factura.items.push(nuevoItem);
    }
    this.productos = [];
    this.inputProducto.nativeElement.value='';
  }
  
  actualizarCantidad(id:number,e:any){
    let cantidad:number = e.target.value as number;
    if(cantidad==0){
      return this.eliminarItem(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id===item.producto.id){
        item.cantidad=cantidad;
      }
      return item;
    })
  }

  existeProducto(id:number){
    let existe = false; 
    this.factura.items.forEach(item=>{
      if(item.producto.id==id){
        existe = true; 
      }
    })
    return existe; 
  }
  incrementarCantidad(id:number){
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id===item.producto.id){
        ++item.cantidad;
      }
      return item;
    })
  }
  eliminarItem(id:number){
    this.factura.items = this.factura.items.filter((item:ItemFactura)=>{
       return id!==item.producto.id
    })
  }
  create(facturaForm:any){
    
    if(!facturaForm.form.invalid && this.factura.items.length>0){
      this.facturaService.create(this.factura).subscribe(resp=>{
        Swal.fire('Factura creada',`Factura ${this.factura.descripcion}`,'success')
        this.router.navigateByUrl(`/facturas/${resp.id}`)
       
      },err=>{
        console.log(err)
      });
    }else{
      if(this.factura.items.length==0){
        Swal.fire('Error','Debes seleccionar productos','error');
        
      }else{
        Swal.fire('Error','Los datos son erroneos','error');
      }
  
    }
    
  }
}
