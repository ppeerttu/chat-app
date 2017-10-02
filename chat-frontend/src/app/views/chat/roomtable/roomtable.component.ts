
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { select, NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { RoomActions } from '../../../actions/room';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

//import * as $ from 'jquery';

import { Room, UsersRoom, User, Message } from '../../../models';

@Component({
  selector: 'room-table',
  templateUrl: './roomtable.component.html',
  styleUrls: ['roomtable.component.css'],
  providers: [RoomActions]
})
export class RoomTableComponent {
  @select() user$: Observable<User>;
  displayedColumns = ['name', 'locked', 'join'];
  roomDataBase = new RoomDataBase();
  roomDataSource: RoomDataSource | null;
  private roomAction: RoomActions;
  private user: User;
  @ViewChild('filter') filter: ElementRef;

  constructor(roomAction: RoomActions) {
    this.roomAction = roomAction;
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
  }

  joinRoom(id: number) {
    console.log('About to join into room with id: ' + id);
    this.roomAction.joinRoom(id, this.user.id, null);
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
      if (this.roomsIn.findIndex(i => i.id === room.id) >= 0) {
        const usersRoom = room.createUsersRoom(true);
        return usersRoom;
      } else {
        const usersRoom = room.createUsersRoom(false);
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
        let search = room.roomName.toLowerCase();
        console.log(room);
        return search.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
