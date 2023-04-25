import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, catchError, map, of, pipe, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
declare const google:any;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario:Usuario | null

  private baseUrl:string = environment.base_url;
  private client_id:string = environment.client_id;

  constructor(private http:HttpClient,private router:Router) { 
    this.usuario = null;
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: this.client_id
    });
  }

  get token():string {
     return localStorage.getItem('token') || "";
  }

  get uid():string {
    return this.usuario?.uid || ''
  }

  logout() {
    localStorage.removeItem('token');
    // localStorage.removeItem('googleEmail');

    if(!this.usuario?.google) {
      this.usuario = null;
      this.router.navigateByUrl('/login');
      return;
    }

    google.accounts.id.revoke(this.usuario?.email, () => {
      
      this.usuario = null;
      this.router.navigateByUrl('/login');
    })
  }

  crearUsuario(formData:RegisterForm) {
    return this.http.post(`${this.baseUrl}/usuarios`, formData)
    .pipe(
      tap(({token}:any) => {
         localStorage.setItem('token', token);
      })
  )
  }

  actualizarPerfil(data: { email:string, nombre:string, role:string }) {

    data = {
      ...data,
      role: this.usuario?.role || 'USER_ROLE'
    }

    return this.http.put(`${this.baseUrl}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    })
  }

  login(loginData:LoginForm) {
    
    return this.http.post(`${this.baseUrl}/login`, loginData)
    .pipe(
        tap(({token}:any) => {
           localStorage.setItem('token', token);
        })
    )
  }

  validarToken(): Observable<boolean> {


    const headers = new HttpHeaders().set('x-token',this.token)

    return this.http.get(`${this.baseUrl}/login/renew`,{
      headers
    }).pipe(
      map((resp:any) => {
        localStorage.setItem('token', resp.token)
        const { uid, nombre, email, role, google, img } = resp.usuario;
        this.usuario = new Usuario(nombre,email,undefined,google,img,role,uid);
        return resp.ok
      }),
      catchError((resp:any) => {

        if(this.usuario?.google) {
          google.accounts.id.revoke(this.usuario?.email)
        }

        localStorage.removeItem('token');
        this.usuario = null;
        // localStorage.removeItem('googleEmail');
        return of(resp.ok)
      })
    )

  }

  loginGoogle(token:string) {
    
    return this.http.post(`${this.baseUrl}/login/google`,{token})
      .pipe(
        tap((resp:any) => {
          localStorage.setItem('token', resp.token);
    
       })
      )
  }

  
}
