
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';

import { RoomInfo, User, Message } from '../../../models';

@Component({
  selector: 'message-container',
  templateUrl: './messagecontainer.component.html',
  styleUrls: [ 'messagecontainer.component.css' ]
})
export class MessageContainerComponent {
  @select() roomsIn$:Observable<RoomInfo[]>;
  @select() viewRoom$:Observable<number>;

  private rooms: RoomInfo[];
  private messages: Message[];
  private roomId: number;
  private users: Object;

  constructor() {
    this.messages = [];
    this.users = {};
  }

  ngOnInit() {
    this.roomsIn$.subscribe(rooms => {
      this.rooms = rooms;
    });
    this.viewRoom$.subscribe(roomId => {
      this.roomId = roomId;
      this.rooms.map(room => {
        if (room.id === roomId) {
          this.messages = room.getMessages();
          room.getUsers().map(user => {
            this.users[user.id] = user
          });
        }
      });
    });
  }
}
