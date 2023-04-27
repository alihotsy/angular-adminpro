import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  

  constructor(
    public modalImagenService:ModalImagenService,
    private fileUploadService:FileUploadService
  ) { }

  public subirArchivo:File | undefined; 
  public imgTemp:any;
  @ViewChild('change') change!: ElementRef<HTMLInputElement>

  ngOnInit(): void {
    
  }

  cerrarModal() {
    this.modalImagenService.cerrarModal();
    this.imgTemp = undefined;
    this.subirArchivo = undefined;
    this.change.nativeElement.value = '';
  }

  cargarArchivo(event:Event) {

    const target = (event.target as HTMLInputElement);
    const file = (target.files as FileList)[0];

    this.subirArchivo = file;

    if(!this.subirArchivo) {
      this.imgTemp = undefined;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirFoto() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(
      this.subirArchivo!,tipo, id
    )
    .then(resp => {

      if(resp.ok) {
        
        Swal.fire({
          title:'Imagen guardada',
          text: 'Los cambios fueron guardados',
          icon: 'success'
        })

        this.modalImagenService.nuevaImagen.emit(resp.nombreArchivo)

        this.cerrarModal();

        return;
      }

      Swal.fire({
        title: 'Error',
        text: resp.msg,
        icon: 'error'
      })


    })
    .catch(err => {
      Swal.fire({
        title: 'Error',
        text: err.error.msg,
        icon: 'error'
      })
    })

  }


}
