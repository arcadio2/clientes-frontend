import { Component, Input, OnInit, AfterViewInit,EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';

import { Pageable, PaginatorCliente } from '../clientes/pageable.models';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit,OnChanges{

  desde:number; 
  hasta:number;

  @Input() paginator:PaginatorCliente;
  @Output() eventPaginador = new EventEmitter<number>();

  paginas:number[]; 

  constructor() { }

  onPaginator(value: number) {
    this.eventPaginador.emit(value);
  }
  ngOnInit() {
    this.initPaginator();
    
  }

  ngOnChanges(changes:SimpleChanges){
    console.log(changes)
    let paginadorActualizado = changes['paginator'];
    if(paginadorActualizado.previousValue){
      this.initPaginator();
    }
  }

  initPaginator(){
    
    this.desde = Math.max(1,this.paginator.number-4);
    //this.hasta = Math.min(Math.min(this.paginator.totalPages,this.paginator.number+4),6);
    this.hasta = this.desde +5;
    if(this.paginator.totalPages>5){
      this.paginas = new Array(this.hasta-this.desde+1).fill(0).map((_valor,indice)=> indice+this.desde);
    }else{
      this.paginas = new Array(this.paginator.totalPages).fill(0).map((_valor,indice)=> indice+1);
    }
  }

}
