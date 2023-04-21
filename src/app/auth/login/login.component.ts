import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'
declare const google:any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef

  public formSubmitted = false;
  
  public loginForm:FormGroup = this.fb.group({
    password: ['', [Validators.required]],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    remember: [false]
  });

  constructor(
    private router: Router, 
    private fb:FormBuilder,
    private usuarioService:UsuarioService,
    private zone: NgZone
  ) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    const getClientId = this.usuarioService.getClientId();

    google.accounts.id.initialize({
      ...getClientId,
      callback: (response:any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response:any) {
    console.log(this);
    this.usuarioService.loginGoogle(response.credential)
          .subscribe({
            next: (resp) => this.zone.run(() => this.router.navigateByUrl('/')),
            error: (err) => console.log(err)
          })
  }

  login() {


    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (value) => {
        if(this.loginForm.get('remember')?.value) {
            localStorage.setItem('email', this.loginForm.get('email')?.value)
            return;
        }

        localStorage.removeItem('email')
        this.router.navigateByUrl('/')
      },
      error: (err) => {
        Swal.fire({
          title:'Error',
          text: err.error.msg,
          icon:'error'
        })
      }
    })
    
    // this.router.navigateByUrl('/')
  }

  ngOnInit(): void {
    
  }

}
