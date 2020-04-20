export interface RelationshipProps {
    from: number;
    to: number;
    mutual?: boolean;
    type?: RelationshipType;
}
export declare class Relationship {
    private static next_id;
    readonly id: number;
    from: number;
    to: number;
    mutual: boolean;
    type: RelationshipType;
    constructor(props: RelationshipProps);
    private static GetRandomType;
}
export interface RelationshipType {
    name: string;
    id: string;
    mutual: boolean;
    type: "family" | "romantic" | "social" | "professional";
    probability: number;
    dashed?: boolean;
    enabled: boolean;
}
export declare let relationshipTypes: RelationshipType[];
export declare enum RomanticRelationshipTypes {
    loves = "Loves",
    dates = "Dates",
    affair = "Has an affair",
    stalks = "Stalks",
    adores = "Adores"
}
