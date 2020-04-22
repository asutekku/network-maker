import {Person} from "./Person";

export class Family {
    public readonly id: number;
    private members: number[];
    name: string;

    private static next_id: number = 0;

    constructor() {
        this.members = [];
        this.id = Family.next_id;
        Family.next_id++;
        this.name = "";
    }

    public add(person: Person): void {
        if (this.members.length === 0) this.name = person.surname;
        this.members.push(person.id);
        person.family_id = this.id;
    }

    public getMembers(): number[] {
        return this.members;
    }

    public addMultiple(people: Person[]): void {
        people.forEach((p: Person) => {
            this.add(p);
        });
    }

}