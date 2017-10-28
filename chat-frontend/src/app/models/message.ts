export class Message {
    userId: number;
    content: string;
    roomId: number;
    time: number;

    constructor(content: string, userId: number, roomId: number, time: number = Date.now()) {
        this.userId = userId;
        this.roomId = roomId;
        this.content = content;
        this.time = time;
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
