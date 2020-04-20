import {femaleNames, maleNames, surnames} from "./names";
import {Relationship, RelationShipType} from "./Relationship";

interface personParams {
    gender?: "female" | "male" | "unspecified";
    age?: number;
    familyID?: number;
    firstName?: string;
    surname?: string;
}

export class Person {
    get relationShips(): Relationship[] {
        return this._relationShips;
    }

    set relationShips(value: Relationship[]) {
        this._relationShips = value;
    }

    set family_id(value: number) {
        this._family_id = value;
    }

    get age(): number {
        return this._age;
    }

    get family_id(): number {
        return this._family_id;
    }

    get gender(): "female" | "male" | "unspecified" {
        return this._gender;
    }

    get surname(): string {
        return this._surname;
    }

    get firstName(): string {
        return this._firstName;
    }

    private static next_id: number = 0;

    public readonly id: number;
    private _firstName: string;
    private _surname: string;
    private _gender: "female" | "male" | "unspecified";
    private _family_id: number;
    private _age: number;
    private _relationShips: Relationship[];

    constructor(params?: personParams) {
        this._gender = params && params.gender ? params.gender : (Math.random() < 0.5) ? 'male' : 'female';
        this._firstName = params && params.firstName ? params.firstName : Person.getName(this._gender);
        this._surname = params && params.surname ? params.surname : surnames[~~(Math.random() * surnames.length)];
        this._family_id = params && params.familyID ? params.familyID : 0;
        this._relationShips = [];
        this._age = params && params.age ? params.age : ~~(Math.random() * 100);
        this.id = Person.next_id;
        Person.next_id++;
    }

    public getFullName(): string {
        return `${this._firstName} ${this._surname}`;
    }

    private static getName(gender: string): string {
        return gender === "female" ? femaleNames[~~(Math.random() * femaleNames.length)] : maleNames[~~(Math.random() * maleNames.length)];
    }

    public newRelationship(person: Person, type?: RelationShipType, mutual?: boolean) {
        let relationShip = new Relationship(this.id, person.id);
        this._relationShips.push(relationShip);
        if (relationShip.mutual) {
            person.addRelationShip(relationShip);
        }
    }

    public addRelationShip(relationship: Relationship) {
        this._relationShips.push(relationship);
    }

}
