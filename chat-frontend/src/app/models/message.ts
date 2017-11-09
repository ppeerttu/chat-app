export class Message {
    private userId: number;
    private userName: string;
    private content: string;
    private roomId: number;
    private time: number;

    constructor(content: string, userId: number, userName: string, roomId: number, time: number = Date.now()) {
        this.userId = userId;
        this.roomId = roomId;
        this.userName = userName;
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

    getTime(): number {
      return this.time;
    }

}
