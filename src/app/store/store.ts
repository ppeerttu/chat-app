import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import { ChatAction } from '../actions/action';
import { Room, RoomInfo, User, Message} from '../models';
import { UserActions } from '../actions/user';
import { RoomActions } from '../actions/room';
import { userReducer } from '../reducers/user';
import { roomReducer } from '../reducers/rooms';
import { roomsInReducer } from '../reducers/roomsIn';
import { viewRoomReducer } from '../reducers/viewRoom';
import { chatReducer } from '../reducers/chat';
import { apiReducer } from '../reducers/api';

export interface AppState {
  loggedIn: boolean,
  user: User,
  rooms: Room[],
  roomsIn: RoomInfo[],
  viewRoom: number,
  waiting: boolean
};

export const INITIAL_STATE: AppState = {
  loggedIn: false,
  user: null,
  rooms: [],
  roomsIn: [],
  viewRoom: null,
  waiting: false
};

export default reduceReducers(apiReducer, userReducer, roomsInReducer, chatReducer, viewRoomReducer, roomReducer);
