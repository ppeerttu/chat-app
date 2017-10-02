import { ChatAction } from '../actions/action';
//import { User } from '../models/user';
import { Room, User, Message} from '../models';
import { UserActions } from '../actions/user';
import { RoomActions } from '../actions/room';

export interface AppState {
  user: User,
  rooms: Room[],
  roomsIn: any
};

export const INITIAL_STATE: AppState = {
  user: null,
  rooms: [],
  roomsIn: []
};

export function rootReducer(state: AppState, action: ChatAction): AppState {
  switch (action.type) {
    case UserActions.LOGIN_REQUEST:
      state = Object.assign({}, state, {
        user: {
          isPending: true
        }
      });
      break;
    case UserActions.LOGIN_SUCCESS:
      if (action.res) {
        const {userName, email, id, firstName, lastName} = action.res;
        state = Object.assign({}, state, {
          user: new User(userName, email, id, firstName, lastName)
        });
      }
      break;
    case UserActions.TOKEN_REQUEST_SUCCESS:
      if (action.res) {
        const {userName, email, id, firstName, lastName} = action.res;
        state = Object.assign({}, state, {
          user: new User(userName, email, id, firstName, lastName)
        });
      }
      break;
    case UserActions.LOGIN_FAILED:
      return Object.assign({}, INITIAL_STATE);
    case UserActions.LOGOUT_SUCCESS:
      return Object.assign({}, INITIAL_STATE);
    case RoomActions.CREATE_ROOM_SUCCESS:
      if (action.res) {
        const {roomName, password, id, createdAt, updatedAt} = action.res;
        state.rooms.push(new Room(roomName, id, password, createdAt, updatedAt));
      }
      break;
    case RoomActions.FETCH_ROOMS_SUCCESS:
      if (action.res) {
        const rooms = action.res.map(room => {
          return new Room(room.roomName, room.id, room.password, room.createdAt, room.updatedAt);
        });
        state = Object.assign({}, state, {
          rooms: rooms
        });
      }
      break;
    case RoomActions.USERS_ROOMS_SUCCESS:
      if (action.res) {
        const rooms = action.res.map(room => {
          return new Room(room.roomName, room.id, room.password, room.createdAt, room.updatedAt);
        });
        state = Object.assign({}, state, {
          roomsIn: rooms
        });
      }
      break;
    default: break;
  }
  return state;
}
