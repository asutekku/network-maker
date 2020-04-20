export interface RelationshipProps {
    from: number,
    to: number,
    mutual?: boolean,
    type?: RelationshipType
}

export class Relationship {
    private static next_id: number = 0;
    public readonly id: number;
    from: number;
    to: number;
    mutual: boolean;
    type: RelationshipType;

    constructor(props: RelationshipProps) {
        this.id = Relationship.next_id;
        Relationship.next_id++;
        this.from = props.from;
        this.to = props.to;
        this.type = props.type ? props.type : Relationship.GetRandomType();
        this.mutual = props.mutual ? props.mutual : this.type.mutual;
    }

    private static GetRandomType(): RelationshipType {
        let probability = Math.random();
        let options = relationshipTypes.filter((r: RelationshipType) => {
            return r.probability > probability && r.type !== "family" && r.enabled;
        });
        return options[~~(Math.random() * options.length)];
    }
}

export interface RelationshipType {
    name: string;
    id: string;
    mutual: boolean;
    type: "family" | "romantic" | "social" | "professional";
    probability: number,
    dashed?: boolean;
    enabled: boolean;
}

export let relationshipTypes: RelationshipType[] = [
    {
        name: "Mother of",
        id: "mother",
        mutual: false,
        probability: 1,
        type: "family",
        enabled: true
    }, {
        name: "Father of",
        id: "father",
        mutual: false,
        probability: 1,
        type: "family",
        enabled: true
    }, {
        name: "Child of",
        id: "child",
        mutual: false,
        probability: 1,
        type: "family",
        enabled: true
    }, {
        name: "Divorced",
        id: "divorced",
        mutual: true,
        probability: 1,
        type: "family",
        dashed: true,
        enabled: true
    }, {
        name: "Spouse",
        id: "spouse",
        mutual: true,
        probability: 1,
        type: "family",
        enabled: true
    }, {
        name: "Knows",
        id: "knows",
        mutual: false,
        probability: 1,
        type: "social",
        enabled: true
    }, {
        name: "Friends",
        id: "friends",
        mutual: true,
        probability: 1,
        type: "social",
        enabled: true
    }, {
        name: "Likes",
        id: "likes",
        mutual: false,
        probability: .5,
        type: "social",
        enabled: true
    }, {
        name: "Dislikes",
        id: "dislikes",
        mutual: false,
        probability: .2,
        type: "social",
        enabled: true
    }, {
        name: "Hates",
        id: "hates",
        mutual: false,
        probability: .1,
        type: "social",
        enabled: true
    }, {
        name: "Admires",
        id: "admires",
        mutual: false,
        probability: .1,
        type: "social",
        enabled: true
    }, {
        name: "Best Friends",
        id: "bestFriends",
        mutual: true,
        probability: .3,
        type: "social",
        enabled: true
    },
];

export enum RomanticRelationshipTypes {
    loves = "Loves",
    dates = "Dates",
    affair = "Has an affair",
    stalks = "Stalks",
    adores = "Adores"
}
