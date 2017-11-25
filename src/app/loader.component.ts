import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';

@Component({
  selector: 'loader-component',
  template: `
  <div class="loader-container">
    <md-progress-bar *ngIf="show" mode="indeterminate" color="accent"></md-progress-bar>
  </div>
  `,
  styles: [
    '.loader-container { position:absolute;z-index:1000;top:0;left:0;width:100%; }'
  ]
})
export class LoaderComponent implements OnInit {
  @select() waiting$: Observable<boolean>;

  private waitingSub;
  show = false;

  constructor(
  ) {}

  ngOnInit() {
    this.waitingSub = this.waiting$.subscribe(waiting => {
      this.show = waiting;
    });
  }

  ngOnDestroy() {
    this.waitingSub.unsubscribe();
  }
}
