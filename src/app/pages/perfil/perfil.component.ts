import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public subirArchivo: File | undefined;
  public imgTemp:any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) { 
     this.usuario = usuarioService.usuario!;
  }

  ngOnInit(): void {

   this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [ Validators.required, Validators.email]]
    });
  }

  actualizarPerfil(): void { 
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
        .subscribe({
          next: (value) =>  {
            const { nombre, email } = this.perfilForm.value;
            this.usuario.nombre = nombre;
            this.usuario.email = email;

            Swal.fire({
              title:'Guardado',
              text: 'Los cambios fueron guardados',
              icon: 'success'
            })
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.error.msg,
              icon: 'error'
            })
          }
        })
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

    this.fileUploadService.actualizarFoto(this.subirArchivo!,'usuarios', this.usuario.uid!)
    .then(resp => {

      if(resp.ok) {
        this.usuario.img = resp.nombreArchivo;
        
        Swal.fire({
          title:'Imagen guardada',
          text: 'Los cambios fueron guardados',
          icon: 'success'
        })

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
