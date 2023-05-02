import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando:boolean = true;
  public medicos: Medico[] = [];
  public medicosTemp:Medico[] = [];
  public imgSuscription!: Subscription;

  constructor(
    private medicoService:MedicoService,
    private modalImagenService:ModalImagenService,
    private busquedasService: BusquedasService
  ) { }
  ngOnDestroy(): void {
    this.imgSuscription.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSuscription = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(resp => {
        this.cargarMedicos();
      })
  }

  cargarMedicos() {
    this.cargando = true;

    this.medicoService.cargarMedicos()
      .subscribe((medicos:Medico[]) => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
      })

  }

  abrirModal(medico:Medico) {
    this.modalImagenService.abrirModal('medicos',medico._id!,medico.img);
  }

  busqueda(termino:string) {

   if(!termino.trim()){
    this.medicos = this.medicosTemp;
    return;
   }

   this.busquedasService.buscar('medicos',termino)
      .subscribe((medicos:any[]) => {
        this.medicos = medicos
      })
  }

  borrarMedico(medico:Medico) {

    Swal.fire({
      title: '¿Borrar Médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id!)
            .subscribe({
              next:(value) => {
                this.cargarMedicos();
                Swal.fire(
                  'Usuario Borrado!',
                  `Usuario ${medico.nombre} fue eliminado correctamente`,
                  'success'
                )
              },
              error:(err) => console.log(err)
            })
      }
    })
  }

}
