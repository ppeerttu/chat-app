import { User, Message } from '.';
import { Room } from './room';

export class RoomInfo extends Room {
  private messages: Message[] = [];
  private users: User[] = [];

  constructor(roomName: string, id: number, password: string, createdAt: string, updatedAt: string) {
    super(roomName, id, password, createdAt, updatedAt);
  }

  static initializeFromRoom(room: Room): RoomInfo {
    return new RoomInfo(room.getRoomName(), room.getId(), room.getPassword(), room.getCreatedAt(), room.getUpdatedAt());
  }

  addMessage(msg: Message) {
    this.messages.push(msg);
  }

  addUser(user: User) {
    this.users.push(user);
  }

  removeUser(user: User) {
    this.users = this.users.reduce((users, x) => {
      if (x.getId() !== user.getId()) {
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
