import { Relationship, RelationShipType } from "./Relationship";
interface personParams {
    gender?: "female" | "male" | "unspecified";
    age?: number;
    familyID?: number;
    firstName?: string;
    surname?: string;
}
export declare class Person {
    get relationShips(): Relationship[];
    set relationShips(value: Relationship[]);
    set family_id(value: number);
    get age(): number;
    get family_id(): number;
    get gender(): "female" | "male" | "unspecified";
    get surname(): string;
    get firstName(): string;
    private static next_id;
    readonly id: number;
    private _firstName;
    private _surname;
    private _gender;
    private _family_id;
    private _age;
    private _relationShips;
    constructor(params?: personParams);
    getFullName(): string;
    private static getName;
    newRelationship(person: Person, type?: RelationShipType, mutual?: boolean): void;
    addRelationShip(relationship: Relationship): void;
}
export {};
