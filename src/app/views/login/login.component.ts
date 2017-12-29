import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { UserActions } from '../../actions';
import { User } from '../../models';

@Component({
    templateUrl: './login.component.html',
    styleUrls: [ 'login.component.scss' ]
})
export class LoginComponent {
  @select() readonly user$: Observable<User>;
  userName: string;
  password: string;
  private userSub;

  constructor(
    private router: Router,
    private action: UserActions,
    public dialog: MatDialog
  ) {
    this.userName = '';
    this.password = '';
  }

  ngOnInit() {
    this.userSub = this.user$.subscribe(user => {
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
        let message = 'Wrong login credentials.';
        if (res.error) {
          if (res.error.message) message = res.error.message;
          else message = res.error;
        }
        let dialogRef = this.dialog.open(LoginFailedDialog, {
          data: { reason: message }
        });
      }
    });
  }

  toRegister(): void {
    this.router.navigateByUrl('/register');
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

@Component({
  templateUrl: 'login-failed-dialog.html'
})
export class LoginFailedDialog {

  constructor(
    public dialogRef: MatDialogRef<LoginFailedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
