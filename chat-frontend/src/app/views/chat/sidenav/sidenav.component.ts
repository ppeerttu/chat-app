
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';
import { ChatActions } from '../../../actions/chat';

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
  private userAction: UserActions;
  private chatAction: ChatActions;
  private user: User;
  private counter: number;

  constructor(
    router: Router,
    userAction: UserActions,
    chatAction: ChatActions
  ) {
    this.userAction = userAction;
    this.chatAction = chatAction;
    this.router = router;
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.counter$.subscribe(counter => {
      this.counter = counter;
    });
    setTimeout(() => {
      this.chatAction.joinRoom(2, this.user);
    }, 2000);
  }

  logout(): void {
    this.userAction.logout().then(() => {
      this.chatAction.closeSocket();
      this.router.navigateByUrl('/login');
    })
  }
}
