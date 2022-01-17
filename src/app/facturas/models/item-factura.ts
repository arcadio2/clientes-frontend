import { Producto } from './producto';
export class ItemFactura {
    producto:Producto;
    cantidad:number;
    importe:number;

    public calcularImporte():number{
        return this.cantidad*this.producto.precio;
    }
}
