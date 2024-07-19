import { Component } from '@angular/core';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-demo',
  templateUrl: './rxjs-demo.component.html',
  styleUrls: ['./rxjs-demo.component.css']
})
export class RxjsDemoComponent {

  //of operator
  //pipe(), tap(), map() operator

  //Observable: a stream of data that arrives async...ly
  learningOfWithMap() {

    //creates an observable that emits value 1,2,3...
    const source$ = of(1, 2, 3);

    //Pipe: used to chain multiple operations together
    //Map: Transforms each value in the stream using a provided function

    const result$ = source$.pipe(map(value => value * 10));

    result$.subscribe(console.log);
  }

  learningOfWithTapMapPipe() {
    const source$ = of(1, 2, 3);

    //Pipe: used to chain multiple operations together
    //Tap: performs action on values and we use it for logging without changing the stream.

    const result$ = source$.pipe(
      tap(value => console.log('Before: ', value)),
      map(value => value * 10),
      tap(value => console.log('After: ', value))
    );

    result$.subscribe();
  }


  learningRxjs() {
    const user$ = of(
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    );

    const modifiedUsers$ = user$.pipe(
      tap(user => console.log('Before map', user)),
      map(user => ({ ...user, name: user.name.toUpperCase() })),
      tap(user => console.log('After map', user))
    );

    modifiedUsers$.subscribe();
  }
}
