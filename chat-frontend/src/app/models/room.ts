
export class Room {
    protected id: number;
    protected roomName: string;
    protected password: string;
    protected createdAt: string;
    protected updatedAt: string;

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

    getId(): number {
      return this.id;
    }

    getPassword(): string {
      return this.password;
    }

    getCreatedAt(): string {
      return this.createdAt;
    }

    getUpdatedAt(): string {
      return this.updatedAt;
    }

}
