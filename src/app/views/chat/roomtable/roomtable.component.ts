import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { select } from '@angular-redux/store';
import { RoomActions, ChatActions } from '../../../actions';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';

import { Room, UsersRoom, User } from '../../../models';

@Component({
  selector: 'room-table',
  templateUrl: './roomtable.component.html',
  styleUrls: ['roomtable.component.scss']
})
export class RoomTableComponent {
  @select() user$: Observable<User>;
  @select() rooms$: Observable<Room[]>;
  @select() roomsIn$: Observable<Room[]>;
  displayedColumns = ['name', 'locked', 'join'];
  roomDataBase = new RoomDataBase();
  roomDataSource: RoomDataSource | null;
  private user: User;
  private rooms: Room[];
  @ViewChild('filter') filter: ElementRef;

  private userSub;
  private roomsSub;
  private roomsInSub;
  private keyFilterSub;

  constructor(
    private roomAction: RoomActions,
    public joinRoomDialog: MatDialog,
    public joinRoomFailed: MatDialog,
    public snackBar: MatSnackBar,
    private chatAction: ChatActions,
  ) {}

  ngOnInit() {
    this.userSub = this.user$.subscribe(user => {
      this.user = user;
    });
    this.roomDataSource = new RoomDataSource(this.roomDataBase);
    this.keyFilterSub = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.roomDataSource) { return; }
        this.roomDataSource.filter = this.filter.nativeElement.value;
      });
    this.roomsSub = this.rooms$.subscribe(rooms => {
      this.rooms = rooms;
      if (!this.roomDataSource) { return; }
      this.roomDataSource.filter = this.filter.nativeElement.value;
    });
    this.roomsInSub = this.roomsIn$.subscribe(roomsIn => {
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

  openSnackBar(message: string, action: string, duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getColor(inRoom: boolean) {
    return inRoom ? 'warn' : 'primary';
  }

  joinRoom(id: number, password: string = null) {
    const room = this.rooms[this.rooms.findIndex(i => i.getId() == id)];
    if (!room.getSecret() || password !== null) {
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
            let error = '';
            try {
              error = JSON.parse(res.res).error;
            } catch(err) {
              console.error(err);
              error = 'Unknown system error';
            } finally {
              reason = error;
            }
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
      let roomName = '';
      const index = this.rooms.findIndex(room => room.getId() == id);
      if (index > -1) {
        roomName = this.rooms[index].getRoomName();
      }
      if (res.type === RoomActions.LEAVE_ROOM_SUCCESS) {
        this.openSnackBar(`Left room ${roomName} successfully`, 'Okay');
        this.chatAction.leaveRoom(id, this.user);
        this.roomAction.selectRoom(null);
      } else {
        let error;
        try {
          error = JSON.parse(res.res).error;
        } catch(error) {
          console.error('Received non-JSON error message from API.');
          error = 'Back end service error.';
        }
        this.openSnackBar(`Failed to leave the room ${roomName}: ${error}. Please refresh the browser.`, 'Okay', 8000);
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.roomsInSub.unsubscribe();
    this.roomsSub.unsubscribe();
    this.keyFilterSub.unsubscribe();
  }
}

@Component({
  templateUrl: 'leave-room-failed-dialog.html'
})
export class LeaveRoomFailedDialog {
  constructor(
    public dialogRef: MatDialogRef<LeaveRoomFailedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

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
    public dialogRef: MatDialogRef<JoinLockedRoomDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  templateUrl: 'room-join-failed-dialog.html'
})
export class RoomJoinFailedDialog {
  constructor(
    public dialogRef: MatDialogRef<RoomJoinFailedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

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
    // NOTE: These should be unsubscribed somehow
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
