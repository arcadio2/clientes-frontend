import { Component, OnInit } from '@angular/core';
import { FacturasService } from '../services/facturas.service';
import { Factura } from '../models/factura';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {

  constructor(private facturasService:FacturasService,
              private activatedRoute:ActivatedRoute) { }
  factura:Factura = new Factura(); 
  titulo:string = "Factura";
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=>{
      let id = +params.get('id');
      console.log(id)
      this.facturasService.getFactura(id).subscribe(resp=>{
        this.factura = resp as Factura; 
        
        console.log(this.factura)
      });
    }) 
     
  }

}
