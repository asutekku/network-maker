import {Person} from "./Person";
import {Family} from "./Family";
import {PeopleCollection} from "./PeopleCollection";

export class PersonBio {
    private person: Person;
    private family: Family;
    private poss: string;
    private pro: string;
    private obj: string;

    constructor(person: Person, collection: PeopleCollection) {
        this.person = person;
        this.family = collection.families.getFamilyByID(person.family_id)!;
        this.pro = person.gender === 'male' ? 'he' : person.gender === 'female' ? 'she' : 'they';
        this.obj = person.gender === 'male' ? 'him' : person.gender === 'female' ? 'her' : 'them';
        this.poss = person.gender === 'male' ? 'his' : person.gender === 'female' ? 'her' : 'theirs';
    }

    public getIntroduction(): string {
        let p = this.person;
        let name = p.getFullName();
        let gender: string = p.gender;
        let nationality = this.person.nationality;

        return `${name} is ${p.age} years old ${nationality} ${gender} who  
        ${p.gender === 'male' || 'female' ? 'lives' : 'live'} in ${this.titleCase(this.person.country)}.
        ${this.family.getMembers().length > 1 ? `There are ${this.family.getMembers().length} people in ${this.poss} family.` : `${this.titleCase(this.pro)} is living on ${this.poss} own.`} `
    }


    titleCase(str: string) {
        const splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    getArticle(str: string): string {
        let vow = 'aeiou';
        return (vow.includes(str[0])) ? 'an' : 'a';
    }

}

export default PersonBio;