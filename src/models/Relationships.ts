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

    public getFromById(id: number): Relationship[] {
        return this.relationShips.filter((r: Relationship) => r.from === id)
    }

    public getToById(id: number): Relationship[] {
        return this.relationShips.filter((r: Relationship) => r.to === id)
    }

    public getAllById(id: number): Relationship[] {
        return this.relationShips.filter((r: Relationship) => r.to === id || r.from === id)
    }

    public clear(): void {
        this.relationShips = [];
    }
}