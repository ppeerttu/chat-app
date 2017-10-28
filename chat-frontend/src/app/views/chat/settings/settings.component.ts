
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';

import { User } from '../../../models';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: [ 'settings.component.css' ],
  providers: [UserActions]
})
export class SettingsComponent {


  constructor() {

  }


}
