import { ChatAction } from '../actions/action';
import { AppState, INITIAL_STATE } from '../store/store';
import { RoomInfo, Message, User } from '../models';
import { ChatActions } from '../actions/chat';

export function chatReducer(state: AppState = INITIAL_STATE, action: ChatAction): AppState {
  // Copy the objects without reference
  let baseState = Object.assign({}, state);
  let base = baseState.roomsIn.slice();
  switch (action.type) {
    case ChatActions.SOCKET_CONNECTED:
      break;
    case ChatActions.SEND_MESSAGE:
    case ChatActions.RECEIVE_MESSAGE:
      if (action.payload) {
        const {roomId, userId, message, time, userName} = action.payload;
        const rooms = base.map(room => {
          if (room.getId() === roomId) {
            room.addMessage(new Message(message, userId, userName, roomId, time));
          }
          return room;
        });
        base = Object.assign([], rooms);
      } else {
        throw new Error(`Action ${action.type} dispatched but no proper payload provided!`);
      }
      break;
    case ChatActions.REQUEST_ROOM_JOIN:
    case ChatActions.RECEIVE_ROOM_JOIN:
    case ChatActions.RECEIVE_USER_INFO:
      if (action.payload) {
        const {roomId, user} = action.payload;
        const rooms = base.map(room => {
          if (room.getId() == roomId) {
            room.addUser(new User(user.userName, user.email, user.id, user.firstName, user.lastName));
            room.addMessage(new Message(`User ${user.userName} has joined the room`, -1, roomId, Date.now()));
          }
          return room;
        });
        base = Object.assign([], rooms);
      } else {
        throw new Error(`Action ${action.type} dispatched but no proper payload provided!`);
      }
      break;
    case ChatActions.ROOM_LEAVE_RECEIVED:
      if (action.payload) {
        const {roomId, user} = action.payload;
        const rooms = base.map(room => {
          if (room.getId() == roomId) {
            room.removeUser(new User(user.userName, user.email, user.id, user.firstName, user.lastName));
            room.addMessage(new Message(`User ${user.userName} has left the room`, -1, roomId, Date.now()));
          }
          return room;
        });
        base = Object.assign([], rooms);
      } else {
        throw new Error(`Action ${action.type} dispatched but no proper payload provided!`);
      }
      break;
    case ChatActions.SOCKET_DISCONNECTED:
      base.map(room => {
        room.deleteAllUsers();
        room.deleteAllMessages();
      });
      break;
    default:
      break;
  }
  return Object.assign({}, baseState, {
    roomsIn: base
  });
}
