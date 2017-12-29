import { ChatAction, RoomActions } from '../actions';
import {
  RoomInfo,
  Room,
  AppState,
  INITIAL_STATE
} from '../models';

export function roomsInReducer(state: AppState = INITIAL_STATE, action: ChatAction): AppState {
  let base = Object.assign({}, state);
  switch (action.type) {
    case RoomActions.USERS_ROOMS_SUCCESS:
      if (action.res) {
        const rooms = action.res.map(room => {
          return new RoomInfo(room.roomName, room.id, room.secret, room.createdAt, room.updatedAt);
        });
        base.roomsIn = rooms;
      }
      break;
    case RoomActions.JOIN_ROOM_SUCCESS:
      if (action.res) {
        const room: RoomInfo = findRoomWithId(action.res.roomId, base.rooms);
        if (room == null) {
          throw Error(`Couldn't find a room with id ${action.res.roomId}.`)
        } else {
          base.roomsIn = base.roomsIn.slice();
          base.roomsIn.push(room);
        }
      }
      break;
    case RoomActions.LEAVE_ROOM_SUCCESS:
      if (action.res) {
        const index = base.roomsIn.findIndex(i => i.getId() == action.res.roomId);
        if (index >= 0) {
          base.roomsIn = base.roomsIn.slice();
          base.roomsIn.splice(index, 1);
        } else {
          throw Error(`Couldn't find a room with id ${action.res.roomId}.`);
        }
      }
      break;
    default:
      break;
  }
  return Object.assign({}, base);
}

function findRoomWithId(id: number, rooms: Room[]): RoomInfo {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].getId() == id) {
      return RoomInfo.initializeFromRoom(rooms[i]);
    }
  }
  return null;
}
