export declare class Relationship {
    private static next_id;
    readonly id: number;
    from: number;
    to: number;
    mutual: boolean;
    type: RelationShipType;
    constructor(from: number, to: number, type?: RelationShipType, mutual?: boolean);
    static GetRandom(): void;
}
export declare enum RelationShipType {
    knows = "Knows",
    likes = "likes",
    loves = "loves",
    spouse = "spouse",
    dating = "dating",
    dislikes = "dislikes",
    affair = "affair",
    mother = "mother of",
    father = "father of",
    child = "child of",
    friends = "friends",
    divorced = "divorced",
    family = "family"
}
