import { AppState, INITIAL_STATE } from '../store/store';
import { ChatAction } from '../actions/action';
import { RoomActions } from '../actions/room';

export function viewRoomReducer(state: number = null, action: ChatAction): number {
  let base = state;
  switch (action.type) {
    case RoomActions.SELECT_ROOM:
      if (action.id) {
        base = action.id;
      } else {
        throw new Error('Action SELECT_ROOM dispatched but no room id given!');
      }
      break;
    default:
      break;
  }
  return base;
}
