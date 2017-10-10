import { combineReducers } from 'redux';
import { ChatAction } from '../actions/action';
import { Room, RoomInfo, User, Message} from '../models';
import { UserActions } from '../actions/user';
import { RoomActions } from '../actions/room';
import { userReducer } from '../reducers/user';
import { roomReducer } from '../reducers/rooms';
import { roomsInReducer } from '../reducers/roomsIn';
import { viewRoomReducer } from '../reducers/viewRoom';

export interface AppState {
  user: User,
  rooms: Room[],
  roomsIn: RoomInfo[],
  viewRoom: number
};

export const INITIAL_STATE: AppState = {
  user: null,
  rooms: [],
  roomsIn: [],
  viewRoom: null
};

export default combineReducers<AppState>({
  user: userReducer,
  rooms: roomReducer,
  roomsIn: roomsInReducer,
  viewRoom: viewRoomReducer
});
