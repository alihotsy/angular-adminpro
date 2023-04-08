import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() {
    const url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';

    this.linkTheme?.setAttribute('href', url);


  }

  changeTheme(theme: string): void {

    const url = `./assets/css/colors/${theme}.css`;

    this.linkTheme?.setAttribute('href',url);
    
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();

  }

  checkCurrentTheme() {
    
    const links:NodeListOf<Element> = document.querySelectorAll('.selector');

     links.forEach(link => {
      link.classList.remove('working');

      const linkTheme = link.getAttribute('data-theme');
      const url = `./assets/css/colors/${linkTheme}.css`; 

      const currentLinkTheme = this.linkTheme?.getAttribute('href');

      if(url === currentLinkTheme) {
        link.classList.add('working');
      }


    })
    
  }
}
