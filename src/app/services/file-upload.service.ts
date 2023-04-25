import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo:File, 
    tipo:'medicos' | 'hospitales' | 'usuarios',
    id:string
  ) {
    try {

    const url = `${base_url}/uploads/${tipo}/${id}`
    const formData = new FormData();
    formData.append("imagen",archivo);

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'x-token': localStorage.getItem('token') || ''
      },
      body: formData
    })

    const data = await resp.json();

    return data

      
    } catch (error) {
      return error;
    }
  }
}
