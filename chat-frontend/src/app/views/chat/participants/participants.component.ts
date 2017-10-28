
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { UserActions } from '../../../actions/user';

import { RoomInfo, User, Message } from '../../../models';

@Component({
  selector: 'participant-container',
  templateUrl: './participants.component.html',
  styleUrls: [ 'participants.component.css' ]
})
export class ParticipantsComponent {
  @select() roomsIn$:Observable<RoomInfo[]>;
  @select() viewRoom$:Observable<number>;

  private rooms: RoomInfo[];
  private roomId: number;
  private users: User[];

  constructor() {
    this.users = [];
  }

  ngOnInit() {
    this.roomsIn$.subscribe(rooms => {
      this.rooms = rooms;
      if (this.roomId) {
        this.rooms.map(room => {
          if (room.id === this.roomId) {
            this.users = room.getUsers();
          }
        });
      }
    });
    this.viewRoom$.subscribe(roomId => {
      this.roomId = roomId;
      this.rooms.map(room => {
        if (room.id === roomId) {
          this.users = room.getUsers();
        }
      });
    });
  }
}
