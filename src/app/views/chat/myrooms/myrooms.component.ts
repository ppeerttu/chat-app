
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { RoomActions } from '../../../actions/room';

import { RoomInfo } from '../../../models';

@Component({
  selector: 'my-rooms',
  templateUrl: './myrooms.component.html',
  styleUrls: [ 'myrooms.component.scss' ]
})
export class MyRoomsComponent {
  @select() roomsIn$:Observable<RoomInfo[]>;
  @select() viewRoom$:Observable<number>;
  rooms: RoomInfo[] = [];
  viewRoom: RoomInfo;

  private roomActions: RoomActions;
  private roomsInSub;
  private viewRoomSub;

  constructor(roomActions: RoomActions) {
    this.roomActions = roomActions;
    this.roomsInSub = this.roomsIn$.subscribe(rooms => {
      this.rooms = rooms;
    });
    this.viewRoomSub = this.viewRoom$.subscribe(id => {
      if (!id) {
        this.viewRoom = null;
      } else {
        this.rooms.map((room:RoomInfo) => {
          if (room.getId() === id) {
            this.viewRoom = room;
          }
        });
      }
    });
  }

  selectRoom(id: number): void {
    this.roomActions.selectRoom(id);
    this.toggleClass(id);
  }

  private toggleClass(id: number): void {
    const elems = document.querySelectorAll('.room-button');
    for (let i = 0; i < elems.length; i++) {
      const elem = elems.item(i);
      if (elem.id === id.toString() && !elem.classList.contains('active')) {
        elem.classList.add('active');
      } else if (elem.id !== id.toString() && elem.classList.contains('active')) {
        elem.classList.remove('active');
      }
    }
  }

  ngOnDestroy() {
    this.roomsInSub.unsubscribe();
    this.viewRoomSub.unsubscribe();
  }

}
