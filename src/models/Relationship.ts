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
    nameTo: string;
    id: string;
    mutual: boolean;
    type: "family" | "romantic" | "social" | "professional";
    probability: number,
    dashed?: boolean;
    enabled: boolean;
    display: boolean;
}

export let relationshipTypes: RelationshipType[] = [
    {
        name: "Child",
        nameTo: "Mother",
        id: "mother",
        mutual: false,
        probability: 1,
        type: "family",
        enabled: true,
        display: true
    }, {
        name: "Child",
        nameTo: "Father",
        id: "father",
        mutual: false,
        probability: 1,
        type: "family",
        enabled: true,
        display: true
    }, {
        name: "Sibling",
        nameTo: "Sibling",
        id: "sibling",
        mutual: true,
        probability: 1,
        type: "family",
        enabled: true,
        display: false
    }, {
        name: "Child of",
        nameTo: "Child",
        id: "child",
        mutual: false,
        probability: 1,
        type: "family",
        enabled: true,
        display: true
    }, {
        name: "Divorced",
        nameTo: "Divorced",
        id: "divorced",
        mutual: true,
        probability: 1,
        type: "family",
        dashed: true,
        enabled: true,
        display: true
    }, {
        name: "Spouse",
        nameTo: "Spouse",
        id: "spouse",
        mutual: true,
        probability: 1,
        type: "family",
        enabled: true,
        display: true
    }, {
        name: "Knows",
        nameTo: "Known By",
        id: "knows",
        mutual: false,
        probability: 1,
        type: "social",
        enabled: true,
        display: true
    }, {
        name: "Friends",
        nameTo: "Friends",
        id: "friends",
        mutual: true,
        probability: 1,
        type: "social",
        enabled: true,
        display: true
    }, {
        name: "Likes",
        nameTo: "Liked by",
        id: "likes",
        mutual: false,
        probability: .5,
        type: "social",
        enabled: true,
        display: true
    }, {
        name: "Dislikes",
        nameTo: "Disliked by",
        id: "dislikes",
        mutual: false,
        probability: .2,
        type: "social",
        enabled: true,
        display: true
    }, {
        name: "Hates",
        nameTo: "Hated By",
        id: "hates",
        mutual: false,
        probability: .1,
        type: "social",
        enabled: true,
        display: true
    }, {
        name: "Admires",
        nameTo: "Admired By",
        id: "admires",
        mutual: false,
        probability: .1,
        type: "social",
        enabled: true,
        display: true
    }, {
        name: "Best Friend",
        nameTo: "Best Friend",
        id: "bestFriends",
        mutual: true,
        probability: .3,
        type: "social",
        enabled: true,
        display: true
    },
];

export enum RomanticRelationshipTypes {
    loves = "Loves",
    dates = "Dates",
    affair = "Has an affair",
    stalks = "Stalks",
    adores = "Adores"
}
