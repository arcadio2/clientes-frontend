import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalService {

  public modal:boolean = false;

  _notificarUpload = new EventEmitter<any>();

  get notificarUpload():EventEmitter<any>{
    return this._notificarUpload;
  }

  constructor() { }

  abrirModal(){
    this.modal = true; 
  }

  cerrarModal(){
    this.modal = false;
  }

}
