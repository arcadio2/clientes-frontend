export class Cliente {
  id: number;
  nombre: string;
  apellido:string;
  createAt:string;
  email: string;

}
export interface SuccesCliente{
  mensaje?:string,
  cliente:Cliente;
}

export class ClienteErrors{
  nombre?:string,
  apellido?:string,
  email?:string,
}