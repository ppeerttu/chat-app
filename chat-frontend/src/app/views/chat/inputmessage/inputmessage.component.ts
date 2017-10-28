
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { ChatActions } from '../../../actions/chat';

import { Room, User, Message } from '../../../models';

@Component({
  selector: 'input-message',
  templateUrl: './inputmessage.component.html',
  styleUrls: [ 'inputmessage.component.css' ]
})
export class InputMessageComponent {
  @select() user$: Observable<User>;
  @select() viewRoom$: Observable<number>;

  private user: User;
  private roomId: number;
  private message: string;

  constructor(private chatAction: ChatActions) {
    this.message = '';
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.viewRoom$.subscribe(roomId => {
      this.roomId = roomId;
    });
  }

  send():void {
    if (this.message.length > 0) {
      this.chatAction.sendMessage(this.roomId, this.user.getId(), this.message);
      this.message = '';
    }
  }

}
