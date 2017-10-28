import { AppState, INITIAL_STATE } from '../store/store';
import { ChatAction } from '../actions/action';
import { RoomActions } from '../actions/room';

export function viewRoomReducer(state: AppState = INITIAL_STATE, action: ChatAction): AppState {
  let viewRoom = state.viewRoom;
  switch (action.type) {
    case RoomActions.SELECT_ROOM:
      if (action.id) {
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
