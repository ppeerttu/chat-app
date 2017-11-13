
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { RoomActions } from '../../../actions/room';
import { ChatActions } from '../../../actions/chat';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { Room, UsersRoom, User, Message } from '../../../models';

@Component({
  selector: 'room-table',
  templateUrl: './roomtable.component.html',
  styleUrls: ['roomtable.component.scss'],
  providers: [RoomActions, ChatActions]
})
export class RoomTableComponent {
  @select() user$: Observable<User>;
  @select() rooms$: Observable<Room[]>;
  @select() roomsIn$: Observable<Room[]>;

  displayedColumns = ['name', 'locked', 'join'];
  roomDataBase = new RoomDataBase();
  roomDataSource: RoomDataSource | null;
  private roomAction: RoomActions;
  private chatAction: ChatActions;
  private user: User;
  private rooms: Room[];
  @ViewChild('filter') filter: ElementRef;

  constructor(
    roomAction: RoomActions,
    chatAction: ChatActions,
    public joinRoomDialog: MdDialog,
    public joinRoomFailed: MdDialog,
    public snackBar: MdSnackBar
  ) {
    this.roomAction = roomAction;
    this.chatAction = chatAction;
    this.user$.subscribe(user => {
      this.user = user;
    });

  }

  ngOnInit() {
    this.roomDataSource = new RoomDataSource(this.roomDataBase);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.roomDataSource) { return; }
        this.roomDataSource.filter = this.filter.nativeElement.value;
      });
    this.rooms$.subscribe(rooms => {
      this.rooms = rooms;
      if (!this.roomDataSource) { return; }
      this.roomDataSource.filter = this.filter.nativeElement.value;
    });
    this.roomsIn$.subscribe(roomsIn => {
      if (!this.roomDataSource) { return; }
      this.roomDataSource.filter = this.filter.nativeElement.value;
    });
  }

  openDialog(roomName: string, roomId: number): void {
    let dialogRef = this.joinRoomDialog.open(JoinLockedRoomDialog, {
      data: { name: 'test', password: '', roomName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.joinRoom(roomId, result);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  getColor(inRoom: boolean) {
    return inRoom ? 'warn' : 'primary';
  }

  joinRoom(id: number, password: string = null) {
    const room = this.rooms[this.rooms.findIndex(i => i.getId() == id)];
    if (room.getPassword() === null || password !== null) {
      this.roomAction.joinRoom(id, this.user.getId(), password).then(res => {
        if (res.type === RoomActions.JOIN_ROOM_SUCCESS) {
          if (res.res && !isNaN(res.res.roomId)) {
            let roomName = '';
            const index = this.rooms.findIndex(room => room.getId() == res.res.roomId);
            if (index > -1) {
              roomName = this.rooms[index].getRoomName();
            }
            this.openSnackBar(`Joined room ${roomName} successfully`, 'Okay');
            this.chatAction.joinRoom(res.res.roomId, this.user);
          } else {
            throw Error('Expected to get a roomId as a property' +
            ' in the room join request response, but got either no roomId or it was not a number');
          }
        } else {
          let roomName = '';
          const index = this.rooms.findIndex(room => room.getId() == id);
          if (index > -1) {
            roomName = this.rooms[index].getRoomName();
          }
          let reason = '';
          if (res.res === "Forbidden") {
            reason = 'Wrong password.';
          } else if (res.res) {
            reason = res.res;
          }
          let dialogRef = this.joinRoomFailed.open(RoomJoinFailedDialog, {
            data: { roomName: roomName, reason: reason }
          });
        }
      });
    }
    else {
      this.openDialog(room.getRoomName(), id);
    }
  }

  leaveRoom(id: number) {
    this.roomAction.leaveRoom(id, this.user.getId()).then((res) => {
      console.log(res);
      if (res.type === RoomActions.LEAVE_ROOM_SUCCESS) {
        let roomName = '';
        const index = this.rooms.findIndex(room => room.getId() == id);
        if (index > -1) {
          roomName = this.rooms[index].getRoomName();
        }
        this.openSnackBar(`Left room ${roomName} successfully`, 'Okay');
        this.chatAction.leaveRoom(id, this.user);
      }
    });
  }
}

@Component({
  templateUrl: 'leave-room-failed-dialog.html',
  styleUrls: ['leave-room-failed-dialog.css']
})
export class LeaveRoomFailedDialog {
  constructor(
    public dialogRef: MdDialogRef<LeaveRoomFailedDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'join-locked-room-dialog',
  templateUrl: 'join-locked-room-dialog.html',
  styleUrls: ['join-locked-room-dialog.css']
})
export class JoinLockedRoomDialog {

  constructor(
    public dialogRef: MdDialogRef<JoinLockedRoomDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  templateUrl: 'room-join-failed-dialog.html',
  styleUrls: ['room-join-failed-dialog.html']
})
export class RoomJoinFailedDialog {
  constructor(
    public dialogRef: MdDialogRef<RoomJoinFailedDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export class RoomDataBase {
  @select() rooms$: Observable<Room[]>;
  @select() roomsIn$: Observable<Room[]>;
  private roomsIn: Room[];
  dataChange: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);

  constructor() {
    this.rooms$.subscribe(rooms => {
      this.dataChange.next(rooms);
    });
    this.roomsIn$.subscribe(roomsIn => {
      this.roomsIn = roomsIn;
    });

  }

  get data(): UsersRoom[] {
    const usersRooms: UsersRoom[] = this.dataChange.value.map((room) => {
      if (this.roomsIn.findIndex(i => i.getId() === room.getId()) >= 0) {
        const usersRoom = UsersRoom.initializeFromRoom(true, room);
        return usersRoom;
      } else {
        const usersRoom = UsersRoom.initializeFromRoom(false, room);
        return usersRoom;
      }
    });
    return usersRooms;
  }

}

export class RoomDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _roomDataBase: RoomDataBase) {
    super();
  }

  connect(): Observable<UsersRoom[]> {
    const displayDataChanges = [
      this._filterChange,
      this._roomDataBase.dataChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      return this._roomDataBase.data.slice().filter((room: UsersRoom) => {
        let search = room.getRoomName().toLowerCase();
        return search.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
