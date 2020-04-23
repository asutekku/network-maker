import React, {Component} from 'react';
import {Person} from "../models/Person";
import {PersonBio} from "../models/PersonBio";
import {PeopleCollection} from "../models/PeopleCollection";
import ParameterGroup from "./ParameterGroup";
import ParameterRow from "./ParameterRow";
import Row from "./Row";
import {Relationship} from "../models/Relationship";
import {Family} from "../models/Family";

interface PersonInfoProps {
    person: Person | undefined;
    collection: PeopleCollection;
    onClick: any;
}

const PersonInfo = (props: PersonInfoProps) => {
    let p: Person | undefined = props.person;
    let b = p ? new PersonBio(p, props.collection) : undefined;
    let f: Family | undefined = p ? props.collection.families.getFamilyByID(p.family_id) : undefined;
    let relationships: Relationship[] | undefined = p ? props.collection.relationships.getAllById(p.id) : undefined;

    const RelationShips = (type: string, flip?: boolean) => {
        const filtered = relationships!.filter((r: Relationship) => ((r.type.type !== type) !== flip));
        const grouped = filtered.reduce((r: any, a: Relationship) => {
            let dir = a.to === p!.id;
            // Group the relationships by whether they are targeted by or if they target the person
            if (!dir) {
                r[a.type.name] = r[a.type.name] || [];
                r[a.type.name].push(a);
            } else {
                r[a.type.nameTo] = r[a.type.nameTo] || [];
                r[a.type.nameTo].push(a);
            }
            return r;
        }, Object.create(null));
        if (grouped.length === 0) return;

        return Object.keys(grouped).map((r: any) => {
            let relationships: Relationship[] = grouped[r];
            let people: Person[] = relationships.map((r: Relationship) => {
                // Checks relations and gets the person depending if they are targeted or if they target someone with the relationship
                return props.collection.people.findPersonByID(r.to === p!.id ? r.from : r.to)!;
            });
            let peopleSpan = people.map((per: Person) => <span className={"link"} onClick={() => props.onClick(per.id)}
                                                               key={`lnk_${per.id}`}>{per.getFullName()}</span>);
            peopleSpan = peopleSpan.flatMap((value, index, array) => (array.length - 1 !== index) ? [value,
                <span>, </span>] : value);
            return <Row title={r} key={`${p!.id}_${r}_asd`} values={peopleSpan}/>
        })
    };

    return (
        <>{
            p && <>
                <div className={'bio-title'}>
                    <h2>{p !== undefined ? p.getFullName() : 'No one selected'}</h2>
                </div>
                <ParameterGroup name={'Description'}>
                    <p>{b !== undefined ? b.getIntroduction() : ''}</p>
                </ParameterGroup>
                {p && <ParameterGroup name={'About'}>
                    <Row title={'First Name'} values={p.firstName}/>
                    <Row title={'Surname'} values={p.surname}/>
                    <Row title={'Age'} values={p.age}/>
                    <Row title={'Gender'} values={p.gender}/>
                    <Row title={'Lives in'} values={p.country}/>
                    <Row title={'Nationality'} values={p.nationality}/>
                </ParameterGroup>
                }
                {f &&
                <ParameterGroup name={'Family'}>
                    <Row title={'Family Name'} values={f.name}/>
                    {
                        RelationShips("family", true)
                    }
                </ParameterGroup>
                }
                {
                    relationships &&
                    <ParameterGroup name={'Relationships'}>
                        {
                            RelationShips("family", false)
                        }
                    </ParameterGroup>
                }</>
        }
        </>
    );
};


export default PersonInfo;