
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';

import { RoomInfo, User, Message } from '../../../models';

@Component({
  selector: 'message-container',
  templateUrl: './messagecontainer.component.html',
  styleUrls: [ 'messagecontainer.component.scss' ]
})
export class MessageContainerComponent {
  @select() roomsIn$: Observable<RoomInfo[]>;
  @select() viewRoom$: Observable<number>;
  @select() user$: Observable<User>;

  private rooms: RoomInfo[];
  private messages: Message[];
  private roomId: number;
  private users: Object;
  private user: User;

  constructor() {
    this.messages = [];
    this.user = null;
    this.roomId = null;
    this.users = {};
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.roomsIn$.subscribe(rooms => {
      this.rooms = rooms;
      this.rooms.map(room => {
        if (this.roomId === room.getId()) {
          this.messages = room.getMessages();
          room.getUsers().map(user => {
            this.users[user.getId()] = user;
          });
        }
      });
      const msgContainer = document.querySelector('.message-container');
      if (msgContainer) {
        // BECAUSE IF DONE IMMEDIATELY, NOT WORKING AS EXPECTED (because of angular bindings)
        setTimeout(() => {
          msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 10);
      }
    });
    this.viewRoom$.subscribe(roomId => {
      this.roomId = roomId;
      this.rooms.map(room => {
        if (room.getId() === roomId) {
          this.messages = room.getMessages();
          room.getUsers().map(user => {
            this.users[user.getId()] = user;
          });
        }
      });
    });
  }
}
