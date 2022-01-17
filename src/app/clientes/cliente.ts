import { Region } from './region';
import { Factura } from '../facturas/models/factura';
export class Cliente {
  id: number;
  nombre: string;
  apellido:string;
  createAt:string;
  email: string;
  foto?:string;
  region:Region;
  facturas?:Factura[]
}
export interface SuccesCliente{
  mensaje?:string,
  cliente:Cliente;
}

export class ClienteErrors{
  nombre?:string;
  apellido?:string;
  email?:string;
  region?:string;
}
