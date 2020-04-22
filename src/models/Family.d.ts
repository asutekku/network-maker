import { Person } from "./Person";
export declare class Family {
    readonly id: number;
    private members;
    name: string;
    private static next_id;
    constructor();
    add(person: Person): void;
    getMembers(): number[];
    addMultiple(people: Person[]): void;
}
