import { Component } from '@angular/core';
//import { NgRedux, select, DevToolsExtension } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

//import { CounterActions } from './actions';
//import { AppState, INITIAL_STATE, rootReducer } from './store';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

  constructor() {}
}
