
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
  messages: Message[];

  private rooms: RoomInfo[];
  private roomId: number;
  private users: Object;
  private user: User;
  private roomsInSub;
  private viewRoomSub;
  private userSub;

  constructor() {
    this.messages = [];
    this.user = null;
    this.roomId = null;
    this.users = {};
  }

  ngOnInit() {
    this.userSub = this.user$.subscribe(user => {
      this.user = user;
    });
    this.roomsInSub = this.roomsIn$.subscribe(rooms => {
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
        // IF DONE IMMEDIATELY, NOT WORKING AS EXPECTED (because of angular bindings)
        setTimeout(() => {
          msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 10);
      }
    });
    this.viewRoomSub = this.viewRoom$.subscribe(roomId => {
      this.roomId = roomId;
      if (!roomId) {
        this.users = {};
        this.messages = [];
      } else {
        this.rooms.map(room => {
          if (room.getId() === roomId) {
            this.messages = room.getMessages();
            room.getUsers().map(user => {
              this.users[user.getId()] = user;
            });
          }
        });
      }

    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.viewRoomSub.unsubscribe();
    this.roomsInSub.unsubscribe();
  }
}
