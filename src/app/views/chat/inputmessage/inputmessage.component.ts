
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
  message: string;
  roomId: number;

  private user: User;
  private userSub;
  private viewRoomsSub;

  constructor(private chatAction: ChatActions) {
    this.message = '';
    this.userSub = this.user$.subscribe(user => {
      this.user = user;
    });
    this.viewRoomsSub = this.viewRoom$.subscribe(roomId => {
      this.roomId = roomId;
    });
  }

  send():void {
    if (this.message.length > 0) {
      this.chatAction.sendMessage(this.roomId, this.user.getId(), this.user.getUserName(), this.message);
      this.message = '';
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.viewRoomsSub.unsubscribe();
  }

}
