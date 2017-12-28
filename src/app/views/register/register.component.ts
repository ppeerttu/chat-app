import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { UserActions } from '../../actions/user';

import { User } from '../../models';

@Component({
    templateUrl: './register.component.html',
    styleUrls: [ 'register.component.scss' ]
})
export class RegisterComponent {
  @select() readonly user$: Observable<User>;

  registerForm: FormGroup;
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = false;
  user: User;
  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(15)
  ]);
  firstNameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(15)
  ]);
  lastNameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(15)
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    Validators.maxLength(15)
  ]);
  confirmPasswordFormControl = new FormControl('', [
    Validators.required
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20)
  ]);

  constructor(
    private router: Router,
    private action: UserActions,
    private fb: FormBuilder,
    public successDialog: MdDialog,
    public failedDialog: MdDialog
  ) {
    // Subscribe the user in store to check if the user is logged in
    this.user$.subscribe(user => {
      if (user && user.getId() > 0) {
        router.navigateByUrl('/chat');
      }
    });
    this.registerForm = fb.group({
      userName: this.usernameFormControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      email: this.emailFormControl,
      password: this.passwordFormControl,
      confirmPassword: this.passwordFormControl
    });
  }

  // Validation function for password confirmation
  passKeyUp(): void {
    if (this.passwordFormControl.touched) {
      // compare values (if both are empty, 'required' -validator will throw an error at user)
      if (this.passwordFormControl.value !== this.confirmPasswordFormControl.value) {
        this.passwordsMatch = false;
        // Make sure no error gets overwritten
        let errors = Object.assign({}, this.confirmPasswordFormControl.errors, { matches: true });
        this.confirmPasswordFormControl.setErrors(errors);
      } else {
        this.passwordsMatch = true;
        // Make sure no errors get overwritten
        let errors = this.confirmPasswordFormControl.errors;
        if (errors && errors.matches) {
          delete errors.matches;
          if (Object.keys(errors).length === 0) {
            errors = null;
          }
        }
        this.confirmPasswordFormControl.setErrors(errors);
      }
    }
  }

  register(): void {
    if (this.passwordsMatch && this.registerForm.valid) {
      this.action.register(this.userName, this.firstName, this.lastName, this.email, this.password).then(res => {
        if (res.type === UserActions.REGISTER_SUCCESS) {
          this.openSuccessDialog();
        } else {
          let message = 'Unknown error! :(';
          if (res.res) {
            let obj = null;
            try {
              obj = JSON.parse(res.res);
              if (obj.error) {
                message = obj.error;
                if (obj.error.message) {
                  message = obj.error.message;
                }
              } else if (obj.message) {
                message = obj.message;
              }
            } catch(e) {
              console.log(e);
            }
          }
          this.openFailedDialog(message);
        }
      });
    }
  }

  backToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  passwordsEqual(): boolean {
    if (this.password === this.confirmPassword) return true;
    return false;
  }

  openSuccessDialog(): void {
    let dialogRef = this.successDialog.open(RegisterSuccessDialog, {
    });
    dialogRef.afterClosed().subscribe(() => {
      this.backToLogin();
    });
  }

  openFailedDialog(message: string = ''): void {
    let dialogRef = this.successDialog.open(RegisterFailedDialog, {
      data: { reason: message}
    });
  }

}

@Component({
  selector: 'register-success-dialog',
  templateUrl: 'register-success-dialog.html',
  styleUrls: ['register-success-dialog.css']
})
export class RegisterSuccessDialog {

  constructor(
    public dialogRef: MdDialogRef<RegisterSuccessDialog>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'register-failed-dialog',
  templateUrl: 'register-failed-dialog.html',
  styleUrls: ['register-failed-dialog.css']
})
export class RegisterFailedDialog {

  constructor(
    public dialogRef: MdDialogRef<RegisterFailedDialog>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
