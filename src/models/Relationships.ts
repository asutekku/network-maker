import {Relationship} from "./Relationship";

export class Relationships {
    public relationShips: Relationship[] = [];

    constructor() {
        this.relationShips = [];
    }

    public add(relationship: Relationship) {
        this.relationShips.push(relationship);
    }

    public addMultiple(relationships: Relationship[]) {
        this.relationShips = [...relationships, ...this.relationShips];
    }

    public getAll(): Relationship[] {
        return this.relationShips;
    }

    public clear(): void {
        this.relationShips = [];
    }
}