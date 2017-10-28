
import { Component, Input } from '@angular/core';
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
  @Input() chatAction: ChatActions;

  private router: Router;
  private userAction: UserActions;
  private user: User;
  private counter: number;
  step = 0;

  constructor(
    router: Router,
    userAction: UserActions
  ) {
    this.userAction = userAction;
    this.router = router;
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.counter$.subscribe(counter => {
      this.counter = counter;
    });
  }

  logout(): void {
    this.userAction.logout().then(() => {
      this.chatAction.closeSocket();
      this.router.navigateByUrl('/login');
    })
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
