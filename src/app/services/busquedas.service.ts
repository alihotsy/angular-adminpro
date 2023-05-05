import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token():string {
    return localStorage.getItem('token') || "";
 }

 get headers() {
  return {
    headers: {
      'x-token': this.token
    }
  }
}

 transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre,user.email,'',user.google,user.img,user.role,user.uid)
    )
 }

 transformarHospitales(resultados: any[]): Hospital[] {
  return resultados;
}

transformarMedicos(resultados: any[]): Medico[] {
  return resultados;
}

busquedaGlobal(termino:string) {
  return this.http.get(`${base_url}/todo/${termino}`,this.headers)
}

 buscar(
  tipo: 'medicos' | 'usuarios' | 'hospitales',
  termino:string
 ):Observable<Usuario[] | Hospital[] | Medico[]> {
   return this.http.get<Usuario[] | Hospital[] | Medico[]>(`${base_url}/todo/coleccion/${tipo}/${termino}`,this.headers)
            .pipe(
              map((resp:any) => {
                switch (tipo) {
                  case 'usuarios':
                    return this.transformarUsuarios(resp.resultado)
                  
                  case 'medicos': 
                    return this.transformarMedicos(resp.resultado)
                
                  case 'hospitales':
                    return this.transformarHospitales(resp.resultado)
                  
                  default:
                     return []
                }
              })
            )

 }
}
