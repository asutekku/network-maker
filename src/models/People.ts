import {Person} from "./Person";

export class People {
    private people: Person[];

    constructor() {
        this.people = []
    }

    public count(): number {
        return this.people.length;
    }

    public getAll(): Person[] {
        return this.people;
    }

    public add(person: Person): void {
        this.people.push(person);
    }

    public addMultiple(people: Person[]): void {
        this.people = [...people, ...this.people];
    }

    public removeByID(id: number): void {
        this.people = this.people.filter((p: Person) => p.id != id);
    }

    public updatePerson(person: Person): void {
        const index = this.people.findIndex((p: Person) => person.id == p.id);
        this.people[index] = person;
    }

    public findPersonByID(id: number): Person | undefined {
        return this.people.find((p: Person) => p.id === id)
    }

    public getFamilyByID(family_id: number): Person[] | undefined {
        return this.people.filter((p: Person) => p.family_id === family_id);
    }
}