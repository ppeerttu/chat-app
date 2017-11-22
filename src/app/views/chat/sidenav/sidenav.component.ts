
import { Component, Input, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { MdSnackBar, MdDialog } from '@angular/material';
import {
  UserActions,
  RoomActions,
  ChatActions
} from '../../../actions';

import { Room, User, Message } from '../../../models';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ 'sidenav.component.scss' ]
})
export class SidenavComponent {
  @select() user$: Observable<User>;
  private user: User;

  constructor(
    private router: Router,
    private userAction: UserActions,
    private roomAction: RoomActions,
    private chatAction: ChatActions,
    private snackBar: MdSnackBar,
    public roomModal: MdDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.userAction = userAction;
    this.user$.subscribe(user => {
      this.user = user;
    });

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
