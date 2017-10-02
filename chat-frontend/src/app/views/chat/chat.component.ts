import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../actions/user';
import { RoomActions } from '../../actions/room';
import * as $ from 'jquery';

import { Room } from '../../models/room';
import { User } from '../../models/user';
import { Message } from '../../models/message';

@Component({
    selector: 'app-root',
    templateUrl: './chat.component.html',
    styleUrls: [ 'chat.component.css' ],
    providers: [UserActions, RoomActions]
})
export class ChatComponent implements OnInit {
  @select() user$: Observable<User>;

  private router: Router;
  private roomAction: RoomActions;
  private userAction: UserActions;
  private user: User;

  constructor(
    router: Router,
    roomAction: RoomActions,
    userAction: UserActions
  ) {
    this.router = router;
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.roomAction = roomAction;
    this.userAction = userAction;
  }

  ngOnInit() {
    if (window.localStorage) {
      if (!window.localStorage.getItem('token')) {
        this.router.navigateByUrl('/login');
      } else {
        if (this.user === null) {
          this.userAction.refreshToken().then(action => {
            this.roomAction.getUsersRooms(action.res.id);
          });
        }
        this.roomAction.fetchAll();
      }
    }
  }
}
/*
export class ChatComponent {
    rooms: Room[] = [new Room('TestroomAlpha', 1, true, "test1"), new Room('TestroomBravo', 2, false, null)];
    messages: Message[] = [new Message('message 1', 1, 1), new Message('Message 2', 1, 1)];
    newRoomName: string = '';
    errorMessage: string = null;
    newRoomHasPassword = false;
    newRoomPassword = null;
    messageContent: string = '';
    user: User = null;
    users: User[] = [new User('testUser', 'test@email.tt', '12345', 0), new User('Erkki', 'eki@email.tt', '12332', 1)];
    myRoom: Room = null;
    newUser: string = '';


    createRoom(): void {
        if (this.user !== null) {
            if (this.myRoom === null) {
                if (this.newRoomName.trim() === '') {
                    this.errorMessage = "Try to input some real characters instead of only whitespace you dumb slut!";
                } else {
                    let size = this.rooms.length + 1;
                    this.rooms.push(new Room(this.newRoomName, size, this.newRoomHasPassword, this.newRoomPassword));
                    this.errorMessage = null;
                    this.newRoomName = '';
                    this.newRoomHasPassword = false;
                    this.newRoomPassword = null;
                }
            } else {
                this.errorMessage = "Bummer! You can't create new room while you're in one.";
            }
        }
    }

    joinRoom(id: number): void {
        if (this.user !== null) {
            if (this.myRoom === null) {
                this.myRoom = this.rooms.find(function(room){
                    return room.id === id;
                })
            } else {
                this.errorMessage = "Bummer! You can't join another room when you're in one.";
            }
        }
    }

    sendMessage(): void {
        if (this.messageContent.trim() !== '') {
            this.messages.push(new Message(this.messageContent, this.user.id, this.myRoom.id));
            this.messageContent = '';
            //const div = document.querySelector('#message-container');
            $('#message-container').scrollTop($('#message-container')[0].scrollHeight);
        }
    }

    leaveRoom(): void {
        this.myRoom = null;
    }


}
*/
