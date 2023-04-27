import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal:boolean = true;
  public tipo!:'usuarios' | 'medicos' | 'hospitales';
  public id:string = "";
  public img:string = "";
  public nuevaImagen: EventEmitter<string> = new EventEmitter();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id:string,
    img:string = "no-image" 
  ) {
    this._ocultarModal = false;

    this.tipo = tipo;
    this.id = id;

    if(img?.includes('https')) {
      this.img = img;
      return;
    }

    this.img = `${base_url}/uploads/${tipo}/${img}`

    // this.img = img;
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
