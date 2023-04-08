import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent {

  @Input() progreso:number = 50;
  @Input() btnClass:string = "btn btn-primary"
  @Output() valorSalida: EventEmitter<number> = new EventEmitter();


  cambiarValor(valor:number) {

    if(this.progreso === 0 && valor < 0) {
      return;
    }

    if(this.progreso === 100 && valor > 0) {
      return;
    }
    this.progreso += valor

    this.valorSalida.emit(this.progreso);

    
  }
  
  onChange(valor:number) {

  
    this.valorSalida.emit(valor);

    
  }

  }
