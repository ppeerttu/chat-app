import { ChatAction } from '../actions/action';
//import { User } from '../models/user';
import { Room, User, Message} from '../models';
import { UserActions } from '../actions/user';
import { RoomActions } from '../actions/room';

export interface AppState {
  user: User,
  rooms: Room[],
  roomsIn: Room[],
  counter: number
};

export const INITIAL_STATE: AppState = {
  user: null,
  rooms: [],
  roomsIn: [],
  counter: 0
};

export function rootReducer(state: AppState, action: ChatAction): AppState {
  let base = Object.assign({}, state);
  switch (action.type) {
    case UserActions.LOGIN_REQUEST:
      base = Object.assign({}, base, {
        user: {
          isPending: true
        }
      });
      break;
    case UserActions.LOGIN_SUCCESS:
      if (action.res) {
        const {userName, email, id, firstName, lastName} = action.res;
        base = Object.assign({}, base, {
          user: new User(userName, email, id, firstName, lastName)
        });
      }
      break;
    case UserActions.TOKEN_REQUEST_SUCCESS:
      if (action.res) {
        const {userName, email, id, firstName, lastName} = action.res;
        base = Object.assign({}, base, {
          user: new User(userName, email, id, firstName, lastName)
        });
      }
      break;
    case UserActions.LOGIN_FAILED:
      break;
      //return Object.assign({}, INITIAL_STATE);
    case UserActions.LOGOUT_SUCCESS:
      return Object.assign({}, INITIAL_STATE);
    case RoomActions.CREATE_ROOM_SUCCESS:
      if (action.res) {
        const {roomName, password, id, createdAt, updatedAt} = action.res;
        base.rooms.push(new Room(roomName, id, password, createdAt, updatedAt));
        base = Object.assign({}, base, {
          rooms: base.rooms
        });
      }
      break;
    case RoomActions.FETCH_ROOMS_SUCCESS:
      if (action.res) {
        const rooms = action.res.map(room => {
          return new Room(room.roomName, room.id, room.password, room.createdAt, room.updatedAt);
        });
        base = Object.assign({}, base, {
          rooms: rooms
        });
      }
      break;
    case RoomActions.USERS_ROOMS_SUCCESS:
      if (action.res) {
        const rooms = action.res.map(room => {
          return new Room(room.roomName, room.id, room.password, room.createdAt, room.updatedAt);
        });
        base = Object.assign({}, base, {
          roomsIn: rooms
        });
      }
      break;
    case RoomActions.JOIN_ROOM_SUCCESS:
      if (action.res) {
        const room = findRoomWithId(action.res.roomId, base.rooms);
        if (room == null) {
          throw Error(`Couldn't find a room with id ${action.res.roomId}.`)
        }
        const rooms = base.roomsIn.map(room => room);
        rooms.push(room);
        base = Object.assign({}, base, {
          roomsIn: rooms
        });
      }
      break;
    case RoomActions.LEAVE_ROOM_SUCCESS:
      if (action.res) {
        const index = base.roomsIn.findIndex(i => i.id == action.res.roomId);
        if (index >= 0) {
          const rooms = base.roomsIn.map(room => room);
          rooms.splice(index, 1);
          base = Object.assign({}, base, {
            roomsIn: rooms
          });
        } else {
          throw Error(`Couldn't find a room with id ${action.res.roomId}.`);
        }
      }
      break;
    case UserActions.INCREMENT:
      base = Object.assign({}, base, {
        counter: base.counter + 1
      });
      break;
    case UserActions.DECREMENT:
      base = Object.assign({}, base, {
        counter: base.counter - 1
      });
      break;
    default: break;
  }
  return Object.assign({}, state, base);
}

function findRoomWithId(id: number, rooms: Room[]): Room {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].id == id) {
      return Object.create(rooms[i]);
    }
  }
  return null;
}
