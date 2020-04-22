import { Family } from "./Family";
export declare class Families {
    families: Family[];
    count(): number;
    constructor();
    add(family: Family): void;
    getFamilyByID(id: number): Family | undefined;
    all(): Family[];
    clear(): void;
}
