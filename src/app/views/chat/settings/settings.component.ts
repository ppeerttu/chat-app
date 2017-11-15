
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MdDialog, MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { UserActions, ChatActions } from '../../../actions';
import { ProfileModalComponent } from '../profilemodal/profilemodal.component';
import { select } from '@angular-redux/store';

import { User } from '../../../models';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: [ 'settings.component.scss' ]
})
export class SettingsComponent {
  @select() user$: Observable<User>;
  private user: User = null;

  constructor(
    private userAction: UserActions,
    private chatAction: ChatActions,
    private router: Router,
    public profileModal: MdDialog,
    public snackBar: MdSnackBar,
    public userProfileFailed: MdDialog
  ) {
    this.user$.subscribe(user => {
      this.user = user;
    });
  }

  goToAbout(): void {
    this.router.navigateByUrl('/about');
  }

  goToHelp(): void {
    this.router.navigateByUrl('/help');
  }

  logout(): void {
    this.userAction.logout().then(() => {
      this.chatAction.closeSocket();
      this.router.navigateByUrl('/login');
    });
  }

  openProfileModal(): void {
    let dialogRef = this.profileModal.open(ProfileModalComponent, {
      data: Object.assign({}, this.user, { password: null, confirmPassword: null })
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userAction.update(result.id, result.userName, result.firstName, result.lastName, result.email, result.password)
          .then(res => {
          if (res.type === UserActions.USER_UPDATE_SUCCESS) {
            this.openSnackBar('Updated user info successfully!', 'Okay');
          } else {
            let reason = '';
            if (res.res) reason = res.res;
            this.userProfileFailed.open(UserProfileUpdateFailed, {
              data: { reason: reason }
            });
          }
        });
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

}

@Component({
  templateUrl: 'user-profile-update-failed.html',
  styleUrls: ['user-profile-update-failed.css']
})
export class UserProfileUpdateFailed {
  constructor(
    public dialogRef: MdDialogRef<UserProfileUpdateFailed>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
