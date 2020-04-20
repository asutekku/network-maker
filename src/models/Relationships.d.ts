import { Relationship } from "./Relationship";
export declare class Relationships {
    relationShips: Relationship[];
    constructor();
    add(relationship: Relationship): void;
    addMultiple(relationships: Relationship[]): void;
    getAll(): Relationship[];
}
