import { AppState, INITIAL_STATE } from '../store/store';
import { ChatAction } from '../actions/action';
import { RoomInfo, User, Message} from '../models';
import { chatReducer } from './chat';
import { RoomActions } from '../actions/room';

export function roomsInReducer(state: RoomInfo[] = [], action: ChatAction): RoomInfo[] {
  let base = state.map(roomInfo => roomInfo);
  switch (action.type) {
    case RoomActions.USERS_ROOMS_SUCCESS:
      if (action.res) {
        base = action.res.map(room => {
          return new RoomInfo(room.roomName, room.id, room.password, room.createdAt, room.updatedAt);
        });
      }
      break;
    case RoomActions.JOIN_ROOM_SUCCESS:
      if (action.res) {
        const room: RoomInfo = findRoomWithId(action.res.roomId, base);
        if (room == null) {
          throw Error(`Couldn't find a room with id ${action.res.roomId}.`)
        } else {
          base.push(room);
          base = base.map(room => room);
        }
      }
      break;
    case RoomActions.LEAVE_ROOM_SUCCESS:
      if (action.res) {
        const index = base.findIndex(i => i.id == action.res.roomId);
        if (index >= 0) {
          base.splice(index, 1);
          base = base.map(room => room);
        } else {
          throw Error(`Couldn't find a room with id ${action.res.roomId}.`);
        }
      }
      break;
    default:
      // Combine chatReducer with roomsInReducer
      base = chatReducer(base, action);
      break;
  }
  return base;
}

function findRoomWithId(id: number, rooms: RoomInfo[]): RoomInfo {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].id == id) {
      return Object.create(rooms[i]);
    }
  }
  return null;
}
