
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';
//import * as $ from 'jquery';

import { Room, User, Message } from '../../../models';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ 'sidenav.component.css' ]
})
export class SidenavComponent {
  @select() user$: Observable<User>;
  @select() readonly counter$: Observable<number>;

  private router: Router;
  private action: UserActions;
  private user: User;
  private counter: number;

  constructor(
    router: Router,
    action: UserActions
  ) {
    this.action = action;
    this.router = router;
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.counter$.subscribe(counter => {
      this.counter = counter;
    });
  }

  logout(): void {
    this.action.logout().then(() => {
      this.router.navigateByUrl('/login');
    })
  }

  increment(): void {
    this.action.increment();
  }

  decrement(): void {
    this.action.decrement();
  }
}
