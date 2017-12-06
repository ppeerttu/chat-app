
export class Room {
    protected id: number;
    protected roomName: string;
    protected secret: boolean;
    protected createdAt: string;
    protected updatedAt: string;

    constructor(roomName: string, id: number, secret: boolean, createdAt: string, updatedAt: string) {
        this.roomName = roomName;
        this.id = id;
        this.secret = secret;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getRoomName(): string {
        return this.roomName;
    }

    getId(): number {
      return this.id;
    }

    getSecret(): boolean {
      return this.secret;
    }

    getCreatedAt(): string {
      return this.createdAt;
    }

    getUpdatedAt(): string {
      return this.updatedAt;
    }

}
