import {Family} from "./Family";

export class Families {
    public families: Family[];

    public count(): number {
        return this.families.length;
    }

    constructor() {
        this.families = [];
    }

    public add(family: Family) {
        this.families.push(family);
    }

    public getFamilyByID(id: number): Family | undefined {
        return this.families.find((f: Family) => f.id === id);
    }

    public all(): Family[] {
        return this.families;
    }

    public clear(): void {
        this.families = [];
    }

}