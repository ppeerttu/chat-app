import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { RoomActions } from '../../../actions/room';

import { Room, User, Message } from '../../../models';

@Component({
  selector: 'create-room',
  templateUrl: './createroom.component.html',
  styleUrls: ['createroom.component.css'],
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

  constructor(
    action: RoomActions,
    public snackBar: MdSnackBar
) {
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
        if (room.getRoomName() == this.roomName) {
          duplicate = true;
        }
      });
      if (!duplicate) {
        this.action.createRoom(this.roomName, this.password, this.user.getId())
          .then(response => {
            if (response.type === RoomActions.CREATE_ROOM_SUCCESS) {
              const roomInfo = response.res;
              this.openSnackBar(`Room ${roomInfo.roomName} created successfully!`, 'Okay', 4000);
              this.roomName = '';
            } else {
              let error;
              try {
                error = JSON.parse(response.res);
                this.openSnackBar(`${error.error}`, 'Okay', 8000);
              } catch (e) {
                console.error('Received non-JSON formatted response for failed room creation request!');
                this.openSnackBar(
                  'Unfortunately something went wrong. Please try to refresh the browser.',
                  'Okay',
                  8000
                );
              }
            }
          }).catch(err => {
            console.error(err);
            this.openSnackBar(
              'Unfortunately something went wrong. Please try to refresh the browser.',
              'Okay',
              8000
            );
          });
      } else {
        console.error(`Duplicate room name: ${this.roomName}`);
        this.openSnackBar('Unfortunately this roomName has been taken', 'Okay', 8000);
      }
    }
  }

  openSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }
}
