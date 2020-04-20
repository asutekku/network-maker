import {Person} from "./Person";

export class Family {
    public readonly id: number;
    private members: number[];

    private static next_id: number = 0;

    constructor() {
        this.members = [];
        this.id = Family.next_id;
        Family.next_id++;
    }

    public add(person: Person): void {
        this.members.push(person.id);
        person.family_id = this.id;
    }

    public getMembers(): number[] {
        return this.members;
    }

    public addMultiple(people: Person[]): void {
        people.forEach((p: Person) => {
            this.members.push(p.id);
            p.family_id = this.id;
        });
    }

}