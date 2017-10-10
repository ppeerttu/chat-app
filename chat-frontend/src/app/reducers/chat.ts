import { ChatAction } from '../actions/action';
import { RoomInfo, Message } from '../models';
import { ChatActions } from '../actions/chat';

export function chatReducer(state: RoomInfo[] = [], action: ChatAction): RoomInfo[] {
  let base = state.map(room => room);
  switch (action.type) {
    case ChatActions.SOCKET_CONNECTED:
      // Keep up the connection state at the redux store?
      break;
    case ChatActions.SEND_MESSAGE:
    case ChatActions.RECEIVE_MESSAGE:
      if (action.payload) {
        const {roomId, userId, message} = action.payload;
        base.map(room => {
          if (room.id === roomId) {
            room.addMessage(new Message(message, userId, roomId));
          }
        });
      } else {
        throw new Error(`Action ${action.type} dispatched but no proper payload provided!`);
      }
      break;
    case ChatActions.REQUEST_ROOM_JOIN:
    case ChatActions.RECEIVE_ROOM_JOIN:
    case ChatActions.RECEIVE_USER_INFO:
      if (action.payload) {
        const {roomId, user} = action.payload;
        base.map(room => {
          if (room.id === roomId) {
            room.addUser(user);
          }
        });
      } else {
        throw new Error(`Action ${action.type} dispatched but no proper payload provided!`);
      }
      break;
    case ChatActions.ROOM_LEAVE_RECEIVED:
      if (action.payload) {
        const {roomId, user} = action.payload;
        base.map(room => {
          if (room.id === roomId) {
            room.removeUser(user);
          }
        });
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
  return base;
}
