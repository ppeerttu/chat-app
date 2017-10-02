export class User {

    userName: string;
    email: string;
    id: number;
    firstName: string;
    lastName: string;

    constructor(userName: string, email: string, id: number, firstName: string, lastName: string) {
        this.userName = userName;
        this.email = email;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getuserName(): string {
        return this.userName;
    }

    getEmail(): string {
        return this.email;
    }

    getId(): number {
        return this.id;
    }

    getFirstName(): string {
      return this.firstName;
    }

    getLastName(): string {
      return this.lastName;
    }

    setuserName(userName: string): void {
      this.userName = userName;
    }

    setEmail(email: string): void {
      this.email = email;
    }

    setId(id: number): void {
      this.id = id;
    }

    setFirstName(firstName: string): void {
      this.firstName = firstName;
    }

    setLastName(lastName: string): void {
      this.lastName = lastName;
    }

}
