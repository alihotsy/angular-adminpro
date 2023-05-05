import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private usuarioService:UsuarioService,
    private router:Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      
     const usuario:Usuario = this.usuarioService.usuario!

     if(usuario.role !== 'ADMIN_ROLE') {
      this.router.navigateByUrl('/dashboard');
      return false;
     }

     return true;
  }
  
}
