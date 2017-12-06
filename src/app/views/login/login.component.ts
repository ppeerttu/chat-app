import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { UserActions } from '../../actions/user';

import { User } from '../../models/user';
import { AppState } from '../../store/store';

@Component({
    templateUrl: './login.component.html',
    styleUrls: [ 'login.component.scss' ]
})

export class LoginComponent {
  @select() readonly user$: Observable<User>;
  userName: string;
  password: string;
  user: User;

  constructor(
    private router: Router,
    private action: UserActions,
    public dialog: MdDialog
  ) {
    this.userName = '';
    this.password = '';
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user && user.getId() > 0) {
        this.router.navigateByUrl('/chat');
      }
    });
    if (window.localStorage) {
      if (window.localStorage.getItem('token')) this.router.navigateByUrl('/chat');
    }
  }

  login(): void {
    this.action.login(this.userName, this.password).then(res => {
      if (res.type === UserActions.LOGIN_FAILED) {
        let dialogRef = this.dialog.open(LoginFailedDialog, {

        });
      }
    });
  }

  toRegister(): void {
    this.router.navigateByUrl('/register');
  }
}

@Component({
  templateUrl: 'login-failed-dialog.html',
  styleUrls: ['login-failed-dialog.html']
})
export class LoginFailedDialog {

  constructor(
    public dialogRef: MdDialogRef<LoginFailedDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
