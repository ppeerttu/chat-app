
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';

import { Room, User, Message } from '../../../models';

@Component({
  selector: 'chat-view',
  templateUrl: './chatview.component.html',
  styleUrls: [ 'chatview.component.css' ]
})
export class ChatViewComponent {

}
