import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../store/store';
import { ApiCall } from '../models/apicall';
import { User } from '../models/user';
import * as io from 'socket.io-client';

@Injectable()
export class ChatActions {
  @select() user$: Observable<User>;

  private user: User;
  private io: any;

  static SOCKET_CONNECTED = 'SOCKET_CONNECTED';
  static SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';

  static SEND_MESSAGE = 'SEND_MESSAGE';
  static RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

  static REQUEST_ROOM_JOIN = 'REQUEST_ROOM_JOIN';
  static RECEIVE_ROOM_JOIN = 'RECEIVE_ROOM_JOIN';

  static RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
  static SEND_USER_INFO = 'SEND_USER_INFO';

  static ROOM_LEAVE_REQUEST = 'ROOM_LEAVE_REQUEST';
  static ROOM_LEAVE_RECEIVED = 'ROOM_LEAVE_RECEIVED';

  /*
  EMIT: message, join, leave, userInfo
  RECEIVE: message, userJoin, userInfo, leave
  */
  constructor(private ngRedux: NgRedux<AppState>) {
    this.io = io('http://localhost:3000', {
      autoConnect: false
    });
    this.io.on('connect', () => {
      this.received(ChatActions.SOCKET_CONNECTED, {});
    });
    this.io.on('userInfo', payload => {
      this.received(ChatActions.RECEIVE_USER_INFO, payload);
    });
    this.io.on('message', payload => {
      this.received(ChatActions.RECEIVE_MESSAGE, payload);
    });
    this.io.on('userJoin', payload => {
      this.received(ChatActions.RECEIVE_ROOM_JOIN, payload);
      payload = Object.assign({}, payload, {
        user: this.user
      });
      if (payload.socketId && payload.roomId) {
        this.sendUserInfo(payload.socketId, this.user, payload.roomId);
      } else {
        throw new Error('userJoin received but payload did not contain socketId or roomId!');
      }
    });
    this.io.on('userLeave', payload => {
      this.received(ChatActions.ROOM_LEAVE_RECEIVED, payload);
    });
    this.io.on('disconnect', reason => {
      this.received(ChatActions.SOCKET_DISCONNECTED, reason);
    });

    this.user$.subscribe(user => {
      this.user = user;
    });
  }

  openSocket() {
    this.io.connect();
  }

  isSocketConnected(): boolean {
    return this.io.connected;
  }

  sendMessage(roomId: number, userId: number, message: string):void {
    if (this.io === null || !this.io.connected) {
      throw new Error('Socket not connected!');
    } else if (roomId === null) {
      throw new Error('Room not selected!');
    } else {
      const time = Date.now();
      const payload = {roomId, userId, message, time};
      this.ngRedux.dispatch({ type: ChatActions.SEND_MESSAGE, payload});
      this.io.emit('message', {roomId, userId, message, time});
    }
  }

  joinRoom(roomId: number, user: User): void {
    const payload = {roomId, user};
    if (this.io === null || !this.io.connected) {
      throw new Error('Socket not connected!');
    } else {
      this.ngRedux.dispatch({ type: ChatActions.REQUEST_ROOM_JOIN, payload });
      this.io.emit('join', { roomId, user });
    }
  }

  sendUserInfo(socketId: string, user: User, roomId: number) {
    const payload = {socketId, user, roomId};
    if (this.io === null || !this.io.connected) {
      throw new Error('Socket not connected!');
    } else {
      this.ngRedux.dispatch({ type: ChatActions.SEND_USER_INFO, payload });
      this.io.emit('userInfo', { socketId, user, roomId });
    }
  }

  leaveRoom(roomId: number, user: User) {
    const payload = {roomId, user};
    if (this.io === null || !this.io.connected) {
      throw new Error('Socket not connected!');
    } else {
      this.ngRedux.dispatch({ type: ChatActions.ROOM_LEAVE_REQUEST, payload });
      this.io.emit('leave', {roomId, user});
    }
  }

  received(type: string, payload: any):void {
    this.ngRedux.dispatch({ type, payload });
  }

  closeSocket(): void {
    if (this.io && this.io.connected) {
      this.io.close(true);
      this.ngRedux.dispatch({ type: ChatActions.SOCKET_DISCONNECTED });
    } else {
      throw new Error('Tried to disconnect the socket even though socket was not connected!');
    }
  }

}
