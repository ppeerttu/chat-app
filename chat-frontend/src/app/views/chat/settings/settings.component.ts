
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions, ChatActions } from '../../../actions';


import { User } from '../../../models';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: [ 'settings.component.css' ]
})
export class SettingsComponent {


  constructor(
    private userAction: UserActions,
    private chatAction: ChatActions,
    private router: Router
  ) {  }

  goToAbout(): void {
    this.router.navigateByUrl('/about');
  }

  logout(): void {
    this.userAction.logout().then(() => {
      this.chatAction.closeSocket();
      this.router.navigateByUrl('/login');
    });
  }

}
