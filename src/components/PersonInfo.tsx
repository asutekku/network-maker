import React, {Component} from 'react';
import {Person} from "../models/Person";
import {PersonBio} from "../models/PersonBio";
import {PeopleCollection} from "../models/PeopleCollection";

interface PersonInfoProps {
    person: Person | undefined;
    collection: PeopleCollection;
}

const PersonInfo = (props: PersonInfoProps) => {
    let p = props.person;
    let b = p ? new PersonBio(p,props.collection) : undefined;
    return (
        <div>
            <h2>{p !== undefined ? p.getFullName() : 'No one selected'}</h2>
            <p>{b !== undefined ? b.getIntroduction() : ''}</p>
        </div>
    );
};


export default PersonInfo;