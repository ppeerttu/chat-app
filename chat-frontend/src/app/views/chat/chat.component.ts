import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../actions/user';
import { RoomActions } from '../../actions/room';
import { ChatActions } from '../../actions/chat';

import { Room } from '../../models/room';
import { User } from '../../models/user';
import { Message } from '../../models/message';

@Component({
    selector: 'app-root',
    templateUrl: './chat.component.html',
    styleUrls: [ 'chat.component.css' ],
    providers: [UserActions, RoomActions, ChatActions]
})
export class ChatComponent implements OnInit {
  @select() user$: Observable<User>;

  private router: Router;
  private roomAction: RoomActions;
  private userAction: UserActions;
  private chatAction: ChatActions;
  private user: User;

  constructor(
    router: Router,
    roomAction: RoomActions,
    userAction: UserActions,
    chatAction: ChatActions
  ) {
    this.router = router;
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.roomAction = roomAction;
    this.userAction = userAction;
    this.chatAction = chatAction;
  }

  ngOnInit() {
    if (window.localStorage) {
      if (!window.localStorage.getItem('token')) {
        this.router.navigateByUrl('/login');
      } else {
        this.chatAction.openSocket();
        if (this.user === null || this.user === undefined) {
          // Get user data and refresh token
          this.userAction.refreshToken().then(action => {
            // Get the rooms user is in
            this.roomAction.getUsersRooms(action.res.id).then(action => {
              // Get all available rooms
              this.roomAction.fetchAll().then(() => {
                // Join each socket room user is in
                action.res.map(room => {
                  this.chatAction.joinRoom(room.id, this.user);
                });
              });
            });
          });
        } else {
          console.log(this.user);
          this.roomAction.getUsersRooms(this.user.id).then(action => {
            this.roomAction.fetchAll().then(() => {
              action.res.map(room => {
                this.chatAction.joinRoom(room.id, this.user);
              });
            });
          });
        }
      }
    }
  }
}
