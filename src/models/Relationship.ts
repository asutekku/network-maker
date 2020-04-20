export class Relationship {


    private static next_id: number = 0;
    public readonly id: number;
    from: number;
    to: number;
    mutual: boolean;
    type: RelationShipType;

    constructor(from: number, to: number, type?: RelationShipType, mutual?: boolean) {
        this.id = Relationship.next_id;
        Relationship.next_id++;
        this.from = from;
        this.to = to;
        this.mutual = mutual ? mutual : false;
        this.type = type ? type : RelationShipType.knows;
    }

    public static GetRandom() {

    }
}


export enum RelationShipType {
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
