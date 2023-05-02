import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay, filter } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public desde:number = 0;
  public cargando:boolean = true;
  public usuariosTemp: Usuario[] = []
  public usuarioActual: Usuario
  public imgSuscription$!: Subscription
  

  constructor(
    private usuarioService:UsuarioService,
    private busquedasService:BusquedasService,
    private modalImagenService:ModalImagenService
  ) { 
    this.usuarioActual = usuarioService.usuario!
  }
  ngOnDestroy(): void {
    this.imgSuscription$.unsubscribe();
  }

  ngOnInit(): void {
   this.cargarUsuarios();
   this.imgSuscription$ = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => {
      this.cargarUsuarios()
   })
  }

  abrirModal(usuario:Usuario) {
    this.modalImagenService.abrirModal('usuarios',usuario.uid!,usuario.img);
  }
  
  cargarUsuarios() {
    this.cargando = true;
    
    this.usuarioService.cargarUsuarios(this.desde)
    .pipe(
      filter(({usuarios}) => usuarios.length > 0),
    )
    .subscribe({
      next: ({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false
      },
      error: (err) => console.log(err)
    })
  }

  cambiarPagina(value:number) {
    this.desde += value;

    if(this.desde < 0) {
      this.desde = 0;
    }

    if(this.desde >= this.totalUsuarios) {
       this.desde -= value
    }
    this.cargarUsuarios();

  }

  buscar(termino:string) {

    if(!termino.trim()) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasService.buscar('usuarios',termino)
         .subscribe({
          next: (usuarios:any[]) => {
            this.usuarios = usuarios;
          },
          error: (err) => console.log(err)
         })
  }

  cambiarRole(usuario:Usuario) {
    this.usuarioService.actualizarUsuario(usuario)
        .subscribe({
          next: (value) => console.log(value),
          error: (err) => console.log(err)
        })
  }

  eliminarUsuario(usuario:Usuario) {

    if(usuario.uid === this.usuarioActual.uid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No puede borrarse a sí mismo'
      })

      return; 
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
            .subscribe({
              next:(value) => {
                this.cargarUsuarios();
                Swal.fire(
                  'Usuario Borrado!',
                  `Usuario ${usuario.nombre} fue eliminado correctamente`,
                  'success'
                )
              },
              error:(err) => console.log(err)
            })
      }
    })
  }

}
