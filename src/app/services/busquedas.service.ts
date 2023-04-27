import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

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

 buscar(
  tipo: 'medicos' | 'usuarios' | 'hospitales',
  termino:string
 ) {
   return this.http.get<any[]>(`${base_url}/todo/coleccion/${tipo}/${termino}`,this.headers)
            .pipe(
              map((resp:any) => {
                switch (tipo) {
                  case 'usuarios':
                    return this.transformarUsuarios(resp.resultado)
                  
                  case 'medicos': 
                    return resp.resultado
                
                  case 'hospitales':
                    return resp.resultado
                }
              })
            )

 }
}
