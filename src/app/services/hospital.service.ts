import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { map } from 'rxjs';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  
  constructor(private http:HttpClient) { }

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

 cargarHospitales() {
   return this.http.get<any[]>(`${base_url}/hospitales`, this.headers)
            .pipe(
              map((resp:any) => resp.hospitales)
            )
 }

 crearHospital(nombre:string) {
  return this.http.post(`${base_url}/hospitales`, {nombre} ,this.headers)
 }

 actualizarHospital(id:string,nombre:string) {
  return this.http.put(`${base_url}/hospitales/${id}`, {nombre} ,this.headers)
 }

 eliminarHospital(id:string) {
   return this.http.delete(`${base_url}/hospitales/${id}`,this.headers)
 }


}
