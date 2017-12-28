import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../actions/user';
import { RoomActions } from '../../actions/room';
import { ChatActions } from '../../actions/chat';
import { User } from '../../models';

@Component({
    templateUrl: './chat.component.html',
    styleUrls: [ 'chat.component.scss' ]
})
export class ChatComponent {
  @select() user$: Observable<User>;
  @select() loggedIn$: Observable<boolean>;
  private user: User;
  private userSub;
  private loggedInSub;

  constructor(
    private router: Router,
    private roomAction: RoomActions,
    private userAction: UserActions,
    private chatAction: ChatActions
  ) {}

  ngOnInit() {
    this.userSub = this.user$.subscribe(user => {
      this.user = user;
    });
    this.loggedInSub = this.loggedIn$.subscribe(logged => {
      if (!logged) this.router.navigateByUrl('/login');
    });

    if (window.localStorage) {
      if (!window.localStorage.getItem('token')) {
        this.router.navigateByUrl('/login');
      } else {
        if (!this.chatAction.isSocketConnected()) {
          return this.chatAction.openSocket().then(() => {
            if (this.user === null || this.user === undefined) {
              // Get user data and refresh token
              this.userAction.refreshToken()
              .then(action => {
                if (
                  action.type === UserActions.TOKEN_REQUEST_FAILED
                  || !action.res
                  || !action.res.id
                ) {
                  return Promise.reject({ reason: action.error ? action.error : 'Unauthorized' });
                }
                return action;
              }) // Get the rooms user is in
              .then(action => this.roomAction.getUsersRooms(action.res.id))
              .then(action => {
                if (action.type === RoomActions.USERS_ROOMS_FAILED) {
                  return Promise.reject({ reason: action.error ? action.error : 'Unauthorized' });
                }
                action.res.map(room => {
                  this.chatAction.joinRoom(room.id, this.user);
                });
                return;
              }) // Get all available rooms
              .then(() => this.roomAction.fetchAll())
              .then((action) => {
                if (action.type === RoomActions.FETCH_ROOMS_FAILED) {
                  return Promise.reject({ reason: action.error ? action.error : 'Unauthorized' });
                }
              });
            } else {
              return this.roomAction.getUsersRooms(this.user.getId())
              .then(action => {
                if (action.type === RoomActions.USERS_ROOMS_FAILED) {
                  return Promise.reject({ reason: action.error ? action.error : 'Unauthorized' });
                }
                action.res.map(room => {
                  this.chatAction.joinRoom(room.id, this.user);
                });
              })
              .then(() => this.roomAction.fetchAll())
              .then(action => {
                if (action.type === RoomActions.FETCH_ROOMS_FAILED) {
                  return Promise.reject({ reason: action.error ? action.error : 'Unauthorized' });
                }
              });
            }
          }).catch(err => {
            console.error(err);
            if (window.localStorage) {
              window.localStorage.removeItem('token');
            }
          });
        }

      }
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.loggedInSub.unsubscribe();
  }
}
