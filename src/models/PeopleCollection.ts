import {People} from "./People";
import {Families} from "./Families";
import {Relationships} from "./Relationships";

export class PeopleCollection {

    public people: People;
    public families: Families;
    public relationships: Relationships;

    constructor() {
        this.people = new People();
        this.families = new Families();
        this.relationships = new Relationships();
    }

    public clear(){
        this.people.clear();
        this.families.clear();
        this.relationships.clear();
    }
}