import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, filter, interval, map, retry, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  intervalSubs: Subscription;


  constructor() { 

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe({
    //   next: val => console.log(val),
    //   complete: () => console.info('Obs terminado'),
    //   error: (err) => console.error(err)
    // });
   this.intervalSubs = this.retornaInterval()
    .pipe(
      // take(10),
      map(x => x+1),
      filter(x => x % 2 === 0)
    )
    .subscribe({
      next: (val) => console.log(val)
    })
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaInterval(): Observable<number> {
    return interval(500);
  
  }

  retornaObservable(): Observable<number> {

    let i = 0;
    
    return new Observable<number>(observer => {

      const interval = setInterval(() => {
        i++;
        observer.next(i);

        console.log(`i = ${i}`);

        if(i === 5) {
          clearInterval(interval);
          observer.complete();
        }

        if(i === 2) {
          clearInterval(interval);
          observer.error('Error 404');
        
        }
      },1000)

    });

  }

  ngOnInit(): void {
  }

}
