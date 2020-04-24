/// <reference types="react" />
import { Person } from "../models/Person";
import { PeopleCollection } from "../models/PeopleCollection";
interface PersonInfoProps {
    person: Person | undefined;
    collection: PeopleCollection;
    onClick: any;
}
declare const PersonInfo: (props: PersonInfoProps) => JSX.Element;
export default PersonInfo;
