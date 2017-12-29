import { ChatAction, RoomActions } from '../actions';
import { Room, AppState, INITIAL_STATE } from '../models';

export function roomReducer(state: AppState = INITIAL_STATE, action: ChatAction): AppState {
  let base = state.rooms.slice();
  switch (action.type) {
    case RoomActions.CREATE_ROOM_SUCCESS:
      if (action.res) {
        const {roomName, password, id, createdAt, updatedAt} = action.res;
        base.push(new Room(roomName, id, !!password, createdAt, updatedAt));
      }
      break;
    case RoomActions.FETCH_ROOMS_SUCCESS:
      if (action.res) {
        base = action.res.map(room => {
          return new Room(room.roomName, room.id, room.secret, room.createdAt, room.updatedAt);
        });
      }
      break;
    default:
      break;
  }
  return Object.assign({}, state, {
    rooms: base
  });
}
