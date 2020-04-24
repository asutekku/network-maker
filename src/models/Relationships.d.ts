import { Relationship } from "./Relationship";
export declare class Relationships {
    relationShips: Relationship[];
    constructor();
    add(relationship: Relationship): void;
    addMultiple(relationships: Relationship[]): void;
    getAll(): Relationship[];
    getFromById(id: number): Relationship[];
    getToById(id: number): Relationship[];
    getAllById(id: number): Relationship[];
    clear(): void;
}
