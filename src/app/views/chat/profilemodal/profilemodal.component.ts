import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'profile-modal-component',
  templateUrl: 'profilemodal.component.html',
  styleUrls: ['profilemodal.component.css']
})
export class ProfileModalComponent {
  passwordsMatch: boolean = true;
  profileForm: FormGroup;

  private password: string = null;
  private confirmPassword: string = null;

  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  firstNameFormControl = new FormControl('', [
    Validators.required
  ]);
  lastNameFormControl = new FormControl('', [
    Validators.required
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  confirmPasswordFormControl = new FormControl('', [
  ]);
  passwordFormControl = new FormControl('', [
    Validators.minLength(6)
  ]);


  constructor(
    public dialogRef: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
    ) {
    this.profileForm = fb.group({
      userName: this.usernameFormControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      email: this.emailFormControl,
      password: this.passwordFormControl,
      confirmPassword: this.passwordFormControl
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  passwordsEqual(): boolean {
    if (this.password === this.confirmPassword) return true;
    return false;
  }

  // Validation function for password confirmation
  passKeyUp(): void {
    // See if both fields are touched
    if (this.passwordFormControl.touched && this.confirmPasswordFormControl.touched) {
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

}
