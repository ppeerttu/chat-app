import { AppState, INITIAL_STATE } from '../store/store';
import { ChatAction } from '../actions/action';
import { Room } from '../models';

import { RoomActions } from '../actions/room';

export function roomReducer(state: Room[] = [], action: ChatAction): Room[] {
  let base = state.map(room => room);
  switch (action.type) {
    case RoomActions.CREATE_ROOM_SUCCESS:
      if (action.res) {
        const {roomName, password, id, createdAt, updatedAt} = action.res;
        base.push(new Room(roomName, id, password, createdAt, updatedAt));
      }
      break;
    case RoomActions.FETCH_ROOMS_SUCCESS:
      if (action.res) {
        base = action.res.map(room => {
          return new Room(room.roomName, room.id, room.password, room.createdAt, room.updatedAt);
        });
      }
      break;
    default:
      break;
  }
  return base;
}
