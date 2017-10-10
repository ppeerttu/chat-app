import { ChatAction } from '../actions/action';
import { Room, User, Message} from '../models';
import { UserActions } from '../actions/user';
import { AppState, INITIAL_STATE } from '../store/store';

export function userReducer(state: User = null, action: ChatAction): User {
  let base = state;
  switch (action.type) {
    case UserActions.LOGIN_SUCCESS:
      if (action.res) {
        const {userName, email, id, firstName, lastName} = action.res;
        base = new User(userName, email, id, firstName, lastName);
      } else {
        throw new Error('Action LOGIN_SUCCESS has dispatched but no user info received!');
      }
      break;
    case UserActions.TOKEN_REQUEST_SUCCESS:
      if (action.res) {
        const {userName, email, id, firstName, lastName} = action.res;
        base = new User(userName, email, id, firstName, lastName);
      } else {
        throw new Error('Action TOKEN_REQUEST_SUCCESS has dispatched but no user info received!');
      }
      break;
    case UserActions.LOGOUT_SUCCESS:
      return null;
    default: break;
  }
  return base;
}
