import { Room } from './room';

export class UsersRoom extends Room {
  private inRoom: boolean;

  constructor(inRoom: boolean, roomName: string, id: number, password: string, createdAt: string, updatedAt: string) {
    super(roomName, id, password, createdAt, updatedAt);
    this.inRoom = inRoom;
  }

  static initializeFromRoom(inRoom: boolean, room: Room): UsersRoom {
    return new UsersRoom(inRoom, room.getRoomName(), room.getId(), room.getPassword(), room.getCreatedAt(), room.getUpdatedAt());
  }

}
