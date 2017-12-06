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
    templateUrl: './chat.component.html',
    styleUrls: [ 'chat.component.scss' ]
})
export class ChatComponent implements OnInit {
  @select() user$: Observable<User>;
  @select() loggedIn$: Observable<boolean>;

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
    this.roomAction = roomAction;
    this.userAction = userAction;
    this.chatAction = chatAction;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.loggedIn$.subscribe(logged => {
      if (!logged) this.router.navigateByUrl('/login');
    });
    if (window.localStorage) {
      if (!window.localStorage.getItem('token')) {
        this.router.navigateByUrl('/login');
      } else {
        if (!this.chatAction.isSocketConnected()) {
          this.chatAction.openSocket().then(() => {
            if (this.user === null || this.user === undefined) {
              // Get user data and refresh token
              this.userAction.refreshToken()
              .then(action => {
                if (
                  action.type === UserActions.TOKEN_REQUEST_FAILED
                  || !action.res
                  || !action.res.id
                ) {
                  return new Promise((resolve, reject) => reject({ reason: action.error ? action.error : 'Unauthorized' }));
                }
                return action;
              }) // Get the rooms user is in
              .then(action => this.roomAction.getUsersRooms(action.res.id))
              .then(action => {
                if (action.type === RoomActions.USERS_ROOMS_FAILED) {
                  return new Promise((resolve, reject) => reject({ reason: action.error ? action.error : 'Unauthorized' }));
                }
                action.res.map(room => {
                  this.chatAction.joinRoom(room.id, this.user);
                });
                return;
              }) // Get all available rooms
              .then(() => this.roomAction.fetchAll())
              .then((action) => {
                if (action.type === RoomActions.FETCH_ROOMS_FAILED) {
                  return new Promise((resolve, reject) => reject({ reason: action.error ? action.error : 'Unauthorized' }));
                }
              }).catch(err => {
                console.error(err.reason);
                if (window.localStorage) {
                  window.localStorage.removeItem('token');
                }
              });
            } else {
              this.roomAction.getUsersRooms(this.user.getId())
              .then(action => {
                if (action.type === RoomActions.USERS_ROOMS_FAILED) {
                  return new Promise((resolve, reject) => reject({ reason: action.error ? action.error : 'Unauthorized' }));
                }
                action.res.map(room => {
                  this.chatAction.joinRoom(room.id, this.user);
                });
              })
              .then(() => this.roomAction.fetchAll())
              .then(action => {
                if (action.type === RoomActions.FETCH_ROOMS_FAILED) {
                  return new Promise((resolve, reject) => reject({ reason: action.error ? action.error : 'Unauthorized' }));
                }
              })
              .catch(err => {
                console.error(err);
                if (window.localStorage) {
                  window.localStorage.removeItem('token');
                }
              });
            }
          }).catch(err => {
            console.error('Socket connection failed: ' + err);
            if (window.localStorage) {
              window.localStorage.removeItem('token');
            }
          });
        }

      }
    }
  }
}
