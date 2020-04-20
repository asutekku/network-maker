import { Person } from "./Person";
export declare class People {
    private people;
    constructor();
    count(): number;
    getAll(): Person[];
    add(person: Person): void;
    addMultiple(people: Person[]): void;
    getRandom(): Person;
    removeByID(id: number): void;
    updatePerson(person: Person): void;
    findPersonByID(id: number): Person | undefined;
    getFamilyByID(family_id: number): Person[] | undefined;
    clear(): void;
}
