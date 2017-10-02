export class Message {
    userId: number;
    content: string;
    roomId: number;

    constructor(content: string, userId: number, roomId: number) {
        this.userId = userId;
        this.roomId = roomId;
        this.content = content;
    }

    getContent(): string {
        return this.content;
    }

    getUser(): number {
        return this.userId;
    }

    getRoom(): number {
        return this.roomId;
    }

}
