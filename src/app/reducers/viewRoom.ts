import { ChatAction, RoomActions } from '../actions';
import { AppState, INITIAL_STATE } from '../models';

export function viewRoomReducer(state: AppState = INITIAL_STATE, action: ChatAction): AppState {
  let viewRoom = state.viewRoom;
  switch (action.type) {
    case RoomActions.SELECT_ROOM:
      if (typeof action.id !== 'undefined') {
        viewRoom = action.id;
      } else {
        throw new Error('Action SELECT_ROOM dispatched but no room id given!');
      }
      break;
    default:
      break;
  }
  return Object.assign({}, state, {
    viewRoom: viewRoom
  });
}
