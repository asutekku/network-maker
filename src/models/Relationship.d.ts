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
    mother = "Mother of",
    father = "Father of",
    child = "Child of",
    divorced = "Divorced",
    spouse = "Spouse"
}
export declare enum SocialRelationshipType {
    friends = "Friends",
    knows = "Knows",
    likes = "Likes",
    dislikes = "Dislikes",
    hates = "Hates",
    admires = "Admires",
    bestFriends = "Best Friends",
    wormates = "Workmates"
}
export declare enum RomanticRelationshipTypes {
    loves = "Loves",
    dates = "Dates",
    affair = "Has an affair",
    stalks = "Stalks",
    adores = "Adores"
}
