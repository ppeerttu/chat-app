import { Component, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  UserActions,
  RoomActions,
  ChatActions
} from '../../../actions';

import { RoomInfo, User } from '../../../models';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ 'sidenav.component.scss' ]
})
export class SidenavComponent {
  @select() user$: Observable<User>;
  @select() roomsIn$: Observable<RoomInfo[]>;
  @select() viewRoom$: Observable<Number>;
  viewRoom: RoomInfo;
  private rooms: RoomInfo[] = null;
  private user: User;
  private viewRoomSub;
  private roomSub;
  private userSub;

  constructor(
    private roomAction: RoomActions,
    private snackBar: MatSnackBar,
    public roomModal: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.userSub = this.user$.subscribe(user => {
      this.user = user;
    });
    this.roomSub = this.roomsIn$.subscribe(rooms => {
      this.rooms = rooms;
    });
    this.viewRoomSub = this.viewRoom$.subscribe(viewRoom => {
      if (this.rooms) {
        this.rooms.map(room => {
          if (room.getId() === viewRoom) {
            this.viewRoom = room;
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.roomSub.unsubscribe();
    this.userSub.unsubscribe();
    this.viewRoomSub.unsubscribe();
  }

  refreshRooms() {
    this.roomAction.fetchAll().then(response => {
      if (response.type === RoomActions.FETCH_ROOMS_SUCCESS) {
        this.openSnackBar('Rooms refreshed successfully', 'Okay', 4000);
      } else {
        this.openSnackBar(
          'Refreshing rooms failed! Please try to refresh the browser.',
          'Okay',
          8000
        );
      }
    });
  }

  openSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }

  openRoomModal() {
    const modalRef = this.roomModal.open(RoomModal, {
      width: '400px',
      height: '500px',
      viewContainerRef: this.viewContainerRef
    });
  }

}

@Component({
  templateUrl: 'room-modal.html',
  styleUrls: ['room-modal.css']
})
export class RoomModal {
  constructor(
    private chatAction: ChatActions
  ) {}
}
