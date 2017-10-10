import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { RoomActions } from '../../../actions/room';

import { Room, User, Message } from '../../../models';

@Component({
  selector: 'create-room',
  templateUrl: './createroom.component.html',
  styleUrls: ['createroom.component.css'],
  providers: [RoomActions]
})
export class CreateRoomComponent {
  @select() rooms$: Observable<Room[]>;
  @select() user$: Observable<User>;

  private action: RoomActions;
  private roomName: string;
  private password: string;
  private locked: boolean;
  private rooms: Room[];
  private user: User;

  roomNameFormControl = new FormControl('', [
    Validators.minLength(3)
  ]);
  passwordFormControl = new FormControl('');

  constructor(action: RoomActions) {
    this.action = action;
    this.roomName = '';
    this.password = '';
    this.locked = false;
    this.rooms = [];
    this.rooms$.subscribe(rooms => {
      this.rooms = rooms;
    });
    this.user$.subscribe(user => {
      this.user = user;
    });
  }

  createRoom(): void {
    // validate room: proper name, no duplicate names, check if locked -> password
    if (this.roomName.length > 2) {
      let duplicate = false;
      this.rooms.map(room => {
        if (room.roomName == this.roomName) {
          duplicate = true;
        }
      });
      if (!duplicate) {
        this.action.createRoom(this.roomName, this.password, this.user.id);
      } else {
        throw Error(`Duplicate room name: ${this.roomName}`);
      }
    }
  }
}
