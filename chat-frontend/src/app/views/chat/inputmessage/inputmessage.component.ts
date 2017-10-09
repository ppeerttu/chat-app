
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';

import { Room, User, Message } from '../../../models';

@Component({
  selector: 'input-message',
  templateUrl: './inputmessage.component.html',
  styleUrls: [ 'inputmessage.component.css' ]
})
export class InputMessageComponent {

  test():void {
    console.log('working');
  }

}
