import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;
  
  public registerForm:FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password2: ['', [Validators.required]],
    terminos: [null, [Validators.required]],
    
  }, {
    validators: [this.passwordsIguales('password','password2')],
  });
  constructor(
    private fb:FormBuilder, 
    private usuarioService:UsuarioService,
    private router:Router
  ) { }
  
  ngOnInit(): void {
    
  }

  passwordsIguales(pass1Name:string, pass2Name:string): ValidationErrors  {

    return (formGroup: AbstractControl) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);


      if(pass1Control?.value === pass2Control?.value) {
         pass2Control?.setErrors(null);
         return null;
      }
      pass2Control?.setErrors({noEsIgual:true})

      return {noEsIgual:true}

    }
  }

  crearUsuario() {
    this.formSubmitted = true;

    if(this.registerForm.invalid) {
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value)
           .subscribe({
            next: (value) => this.router.navigateByUrl('/'),
            error: (err) => {
              Swal.fire({
                title:'Error',
                text: err.error.msg,
                icon:'error'
              })
            }
           })
    
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted
  }

  passwordsNovalidos() {

   const pass1 = this.registerForm.get('password');
   const pass2 = this.registerForm.get('password2');

   if((!pass1?.value && !pass2?.value) && this.formSubmitted) {
      return true;
   }

   if((pass1?.value !== pass2?.value) && this.formSubmitted) {
      return true;
   }

   return false;

  }

  campoNoValido(campo:string):boolean {
    return this.formSubmitted && !this.registerForm.get(campo)?.valid;
  }

}
