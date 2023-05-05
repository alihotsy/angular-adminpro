import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios:Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];
  public cargando:boolean = true;

  constructor(
    private activatedRoute:ActivatedRoute,
    private busquedasService:BusquedasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(({q}) => this.busquedaGlobal(q))
  }

  busquedaGlobal(termino:string) {
    this.cargando = true
    this.busquedasService.busquedaGlobal(termino)
       .subscribe((resp:any) => {
        this.cargando = false
        this.usuarios = resp.usuarios
        this.medicos = resp.medicos
        this.hospitales = resp.hospitales
       })
  }

}
