export enum SocketData {
  MESSAGE_SENT = 1,
  MESSAGE_RECEIVED = 2,
  ROOM_INFO_REQUEST = 3,
  USER_INFO_RECEIVED = 4
};

export class SocketCall {

  constructor(
    private type: SocketData,
    private payload: any
  ) {}
}
