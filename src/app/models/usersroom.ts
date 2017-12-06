import { Room } from './room';

export class UsersRoom extends Room {
  private inRoom: boolean;

  constructor(inRoom: boolean, roomName: string, id: number, secret: boolean, createdAt: string, updatedAt: string) {
    super(roomName, id, secret, createdAt, updatedAt);
    this.inRoom = inRoom;
  }

  static initializeFromRoom(inRoom: boolean, room: Room): UsersRoom {
    return new UsersRoom(inRoom, room.getRoomName(), room.getId(), room.getSecret(), room.getCreatedAt(), room.getUpdatedAt());
  }

}
