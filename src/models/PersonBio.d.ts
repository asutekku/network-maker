import { Person } from "./Person";
import { PeopleCollection } from "./PeopleCollection";
export declare class PersonBio {
    private person;
    private family;
    private poss;
    private pro;
    private obj;
    constructor(person: Person, collection: PeopleCollection);
    getIntroduction(): string;
    titleCase(str: string): string;
    getArticle(str: string): string;
}
export default PersonBio;
