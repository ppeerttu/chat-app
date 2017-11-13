
import { Action } from 'redux';
import { SocketCall } from '../models/socketcall';

export abstract class ChatAction implements Action {
  type: any;
  res: any;
  id: number;
  payload: any;
}
