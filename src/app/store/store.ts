import * as reduceReducers from 'reduce-reducers';
import {
  UserActions,
  RoomActions,
  ChatAction
} from '../actions';
import { userReducer } from '../reducers/user';
import { roomReducer } from '../reducers/rooms';
import { roomsInReducer } from '../reducers/roomsIn';
import { viewRoomReducer } from '../reducers/viewRoom';
import { chatReducer } from '../reducers/chat';
import { apiReducer } from '../reducers/api';

export default reduceReducers(apiReducer, userReducer, roomsInReducer, chatReducer, viewRoomReducer, roomReducer);
