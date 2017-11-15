
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { RoomActions } from '../../../actions/room';

import { RoomInfo, User, Message } from '../../../models';

@Component({
  selector: 'my-rooms',
  templateUrl: './myrooms.component.html',
  styleUrls: [ 'myrooms.component.scss' ]
})
export class MyRoomsComponent {
  @select() roomsIn$:Observable<RoomInfo[]>;
  @select() viewRoom$:Observable<number>;
  private rooms: RoomInfo[] = [];
  private roomActions: RoomActions;
  private viewRoom: RoomInfo;

  constructor(roomActions: RoomActions) {
    this.roomActions = roomActions;
    this.roomsIn$.subscribe(rooms => {
      this.rooms = rooms;
    });
    this.viewRoom$.subscribe(id => {
      this.rooms.map((room:RoomInfo) => {
        if (room.getId() === id) {
          this.viewRoom = room;
        }
      });
    });
  }

  selectRoom(id: number): void {
    this.roomActions.selectRoom(id);
    this.toggleClass(id);
  }

  private toggleClass(id: number): void {
    let btn = document.getElementById(id.toString());
    if (!btn.classList.contains('active')) {
      btn.classList.add('active');
    }
    this.rooms.map(room => {
      if (room.getId() !== id) {
        let elem = document.getElementById(room.getId().toString());
        if (elem.classList.contains('active')) {
          elem.classList.remove('active');
        }
      }
    });
  }

}
