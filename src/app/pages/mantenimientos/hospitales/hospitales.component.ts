import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando:boolean = true;
  public imgSuscription$!: Subscription

  constructor(
    private hospitalService:HospitalService,
    private modalImagenService:ModalImagenService,
    private busquedasService:BusquedasService
  ) { }

  ngOnInit(): void {
     this.cargarHospitales();
   this.imgSuscription$ = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => {
      this.cargarHospitales()
   })
  }

  busquedas(termino:string) {

    if(!termino.trim()) {
      this.hospitales = this.hospitalesTemp;
      return;
    }

    this.busquedasService.buscar('hospitales',termino)
       .subscribe((hospitales:Hospital[]) => {
         this.hospitales = hospitales
       })
  } 
  
  cargarHospitales() {
    
    this.cargando = true;
    this.hospitalService.cargarHospitales()
       .subscribe({
         next: (hospitales) => {
          this.cargando = false;
          this.hospitales = hospitales;
          this.hospitalesTemp = hospitales;
  
         },
         error: (error) => console.log(error)
       })
  }

  guardarCambios(hospital:Hospital) {
    this.hospitalService.actualizarHospital(hospital._id!,hospital.nombre)
      .subscribe({
        next: (resp) => {
          Swal.fire({
            title: 'Actualizado',
            text: hospital.nombre,
            icon: 'success'
          })
          
        },
        error: (err) => console.log(err)
      })
  }

  eliminarHospital(hospital:Hospital) {

    this.hospitalService.eliminarHospital(hospital._id!)
    .subscribe({
      next: (resp) => {
        Swal.fire({
          title: 'Eliminado',
          text: hospital.nombre,
          icon: 'success'
        })
        this.cargarHospitales();
      },
      error: (err) => console.log(err)
    })
  }

  async abrirSweetAlert() {
    const { value } = await Swal.fire<string>({
      title:'Crear Hospital',
      input: 'text',
      text: 'Ingresa un nombre de un hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton:true
    })
    
    if (value?.trim()) {
      this.hospitalService.crearHospital(value)
         .subscribe({
          next: (resp:any) =>  {
            this.hospitales.push(resp.hospital)
          }
         })
    }
  }

  abrirModal(hospital:Hospital) {
    this.modalImagenService.abrirModal('hospitales',hospital._id!,hospital.img)
  }

}
