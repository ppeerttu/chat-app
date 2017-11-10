import { Component } from '@angular/core';
import { UserActions, RoomActions, ChatActions } from './actions';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  providers: [UserActions, RoomActions, ChatActions]
})
export class AppComponent {

  constructor() {}
}
