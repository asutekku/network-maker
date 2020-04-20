export declare class Relationship {
    private static next_id;
    readonly id: number;
    from: number;
    to: number;
    mutual: boolean;
    type: FamilyRelationshipType | SocialRelationshipType;
    constructor(from: number, to: number, type?: FamilyRelationshipType | SocialRelationshipType, mutual?: boolean);
    private GetRandomType;
}
export declare enum FamilyRelationshipType {
    mother = "mother of",
    father = "father of",
    child = "child of",
    divorced = "divorced",
    spouse = "spouse"
}
export declare enum SocialRelationshipType {
    friends = "Friends",
    knows = "Knows",
    likes = "Likes",
    loves = "Loves",
    dating = "Dates",
    dislikes = "Dislikes",
    affair = "Has an affair"
}
