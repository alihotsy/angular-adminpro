import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, catchError, map, of, pipe, tap } from 'rxjs';
import { Router } from '@angular/router';
declare const google:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private email:string = localStorage.getItem('googleEmail') || '';

  private clientId = {
    client_id: "286053610181-8l45sc9kg1h1knhmgchugukmuuuadade.apps.googleusercontent.com"
  }

  private baseUrl:string = environment.base_url;

  constructor(private http:HttpClient,private router:Router) { 
    this.googleInit();
  }

  getClientId() {
    return structuredClone(this.clientId);
  }

  googleInit() {
    google.accounts.id.initialize(this.clientId);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('googleEmail');

    google.accounts.id.revoke(this.email, () => {
      
      this.router.navigateByUrl('/login')
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

  login(loginData:LoginForm) {
    return this.http.post(`${this.baseUrl}/login`, loginData)
    .pipe(
        tap(({token}:any) => {
           localStorage.setItem('token', token);
        })
    )
  }

  validarToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || "";

    const headers = new HttpHeaders().set('x-token',token)

    return this.http.get(`${this.baseUrl}/login/renew`,{
      headers
    }).pipe(
      map((resp:any) => {
        localStorage.setItem('token', resp.token)
        return resp.ok
      }),
      catchError((resp:any) => {
        google.accounts.id.revoke(this.email)
        localStorage.removeItem('token');
        localStorage.removeItem('googleEmail');
        return of(resp.ok)
      })
    )

  }

  loginGoogle(token:string) {
    return this.http.post(`${this.baseUrl}/login/google`,{token})
      .pipe(
        tap((resp:any) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('googleEmail',resp.email);
          this.email = resp.email;
       })
      )
  }

  
}
