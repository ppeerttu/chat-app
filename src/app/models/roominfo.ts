import { User, Message } from '.';
import { Room } from './room';

export class RoomInfo extends Room {
  private messages: Message[] = [];
  private users: User[] = [];

  constructor(roomName: string, id: number, secret: boolean, createdAt: string, updatedAt: string) {
    super(roomName, id, secret, createdAt, updatedAt);
  }

  static initializeFromRoom(room: Room): RoomInfo {
    return new RoomInfo(room.getRoomName(), room.getId(), room.getSecret(), room.getCreatedAt(), room.getUpdatedAt());
  }

  addMessage(msg: Message) {
    this.messages.push(msg);
  }

  addUser(user: User): boolean {
    let found = false;
    this.users.map(i => {
      if (i.getId()  === user.getId()) {
        found = true;
      }
    });
    if (!found) {
      this.users.push(user);
      this.addMessage(new Message(`User ${user.getUserName()} has joined the room`, -1, this.getId().toString(), Date.now()));
      return true;
    }
    return false;
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
