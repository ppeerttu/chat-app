export class Room {
    id: number;
    roomName: string;
    password: string;
    createdAt: string;
    updatedAt: string;

    constructor(roomName: string, id: number, password: string, createdAt: string, updatedAt: string) {
        this.roomName = roomName;
        this.id = id;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getRoomName(): string {
        return this.roomName;
    }

    createUsersRoom(inRoom: boolean): UsersRoom {
      return new UsersRoom(inRoom, this.roomName, this.id, this.password, this.createdAt, this.updatedAt);
    }
}

export class UsersRoom extends Room {
  private inRoom: boolean;

  constructor(inRoom: boolean, roomName: string, id: number, password: string, createdAt: string, updatedAt: string) {
    super(roomName, id, password, createdAt, updatedAt);
    this.inRoom = inRoom;
  }

}
