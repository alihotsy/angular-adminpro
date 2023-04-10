import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo!:string;
  public tituloSubs$: Subscription;

  constructor(private router: Router) {
    this.tituloSubs$ = this.getDataRuta().subscribe(({titulo})=> {
      this.titulo = titulo;
    })
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getDataRuta() {

    return this.router.events
    .pipe(
      filter ( (event): event is ActivationEnd => event instanceof ActivationEnd ),
      filter((event:ActivationEnd ) => event.snapshot.firstChild === null),
      map((event:ActivationEnd ) => event.snapshot.data)
    )


  }

  ngOnInit(): void {
  }

}
