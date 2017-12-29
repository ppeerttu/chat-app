import { User } from './user';
import { Room } from './room';
import { RoomInfo } from './roomInfo';

export interface AppState {
  loggedIn: boolean,
  user: User,
  rooms: Room[],
  roomsIn: RoomInfo[],
  viewRoom: number,
  waiting: boolean
};

export const INITIAL_STATE: AppState = {
  loggedIn: false,
  user: null,
  rooms: [],
  roomsIn: [],
  viewRoom: null,
  waiting: false
};
