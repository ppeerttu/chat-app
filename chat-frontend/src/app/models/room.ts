import { Message, User } from '.';

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

    createRoomInfo(): RoomInfo {
      return new RoomInfo(this.roomName, this.id, this.password, this.createdAt, this.updatedAt);
    }
}

export class UsersRoom extends Room {
  private inRoom: boolean;

  constructor(inRoom: boolean, roomName: string, id: number, password: string, createdAt: string, updatedAt: string) {
    super(roomName, id, password, createdAt, updatedAt);
    this.inRoom = inRoom;
  }

}

export class RoomInfo extends Room {
  private messages: Message[] = [];
  private users: User[] = [];

  addMessage(msg: Message) {
    this.messages.push(msg);
  }

  addUser(user: User) {
    this.users.push(user);
  }

  removeUser(user: User) {
    this.users = this.users.reduce((users, x) => {
      if (x.id !== user.id) {
        users.push(x);
      }
      return users;
    }, []);
  }

  getMessages(): Message[] {
    return this.messages;
  }

  getUsers(): User[] {
    return this.users;
  }

  deleteAllMessages() {
    this.messages = [];
  }

  deleteAllUsers() {
    this.users = [];
  }
}
