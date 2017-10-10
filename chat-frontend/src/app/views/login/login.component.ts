import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { UserActions } from '../../actions/user';

import * as $ from 'jquery';

import { User } from '../../models/user';
import { AppState } from '../../store/store';

@Component({
    selector: 'app-root',
    templateUrl: './login.component.html',
    styleUrls: [ 'login.component.css' ],
    providers: [UserActions]
})

export class LoginComponent {
  @select() readonly user$: Observable<User>;
  userName: string;
  password: string;
  user: User;
  usernameFormControl = new FormControl('', [
    Validators.required
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private router: Router,
    private action: UserActions
  ) {
    this.userName = '';
    this.password = '';
    // Subscribe the user in store to check when user is logged in
    this.user$.subscribe(user => {
      console.log(user);
      if (user && user.id > 0) {
        router.navigateByUrl('/chat');
        console.log('navigated');
      }
    });
  }

  login(): void {
    this.action.login(this.userName, this.password);
  }
}
