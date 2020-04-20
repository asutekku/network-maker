import { People } from "./People";
import { Families } from "./Families";
import { Relationships } from "./Relationships";
export declare class PeopleCollection {
    people: People;
    families: Families;
    relationships: Relationships;
    constructor();
    clear(): void;
}
