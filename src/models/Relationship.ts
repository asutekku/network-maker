export class Relationship {


    private static next_id: number = 0;
    public readonly id: number;
    from: number;
    to: number;
    mutual: boolean;
    type: FamilyRelationshipType | SocialRelationshipType;

    constructor(from: number, to: number, type?: FamilyRelationshipType | SocialRelationshipType, mutual?: boolean) {
        this.id = Relationship.next_id;
        Relationship.next_id++;
        this.from = from;
        this.to = to;
        this.mutual = mutual ? mutual : Math.random() <= 0.5;
        this.type = type ? type : this.GetRandomType();
    }

    private GetRandomType(): SocialRelationshipType {
        let types: SocialRelationshipType[] = Object.values(SocialRelationshipType);
        return types[~~(Math.random() * types.length)];
    }
}


export enum FamilyRelationshipType {
    mother = "mother of",
    father = "father of",
    child = "child of",
    divorced = "divorced",
    spouse = "spouse",
}

export enum SocialRelationshipType {
    friends = "Friends",
    knows = "Knows",
    likes = "Likes",
    loves = "Loves",
    dating = "Dates",
    dislikes = "Dislikes",
    affair = "Has an affair",
}
