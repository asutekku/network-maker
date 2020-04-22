import * as React from 'react';
import './assets/scss/App.scss';
import {Graph} from "./components/RelationshipGraph";
import ParameterGroup from "./components/ParameterGroup";
import Slider from "./components/Slider";
import {Relationship, RelationshipType, relationshipTypes} from "./models/Relationship";
import {Family} from "./models/Family";
import {PeopleCollection} from "./models/PeopleCollection";
import {Person} from "./models/Person";
import {DataGroup, DataItem, DataSet, Edge, Network, Node} from "vis";
import Dropdown from "./components/Dropdown";
import PersonInfo from "./components/PersonInfo";

export interface AppProps {

}

interface AppState {
    nodes: DataSet<DataItem | DataGroup | Node | Edge> | undefined;
    edges: DataSet<DataItem | DataGroup | Node | Edge> | undefined;
    data: any;
    selected: Person | undefined;
}

interface AppOptions {
    familyCount: number,
    minChildren: number,
    maxChildren: number,
    minRelationship: number,
    maxRelationship: number,
    singleProbability: number,
    singles: boolean,
    nationalities: string[]
    countries: string[]
}


export default class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            nodes: undefined, edges: undefined, data: undefined, selected: undefined
        }
    }

    countries: string[] = ['the united states', 'Japan', 'Finland', "Italy"];
    nationalities: string[] = ["american", "japanese", "finnish", "italian"];

    collection: PeopleCollection = new PeopleCollection();
    options: AppOptions = {
        familyCount: 10,
        minChildren: 0,
        maxChildren: 3,
        minRelationship: 0,
        maxRelationship: 2,
        singleProbability: 20,
        singles: true,
        nationalities: [this.nationalities[0]],
        countries: [this.countries[0]]
    };

    componentDidMount(): void {
        this.createFamilies();
        this.generateRelationships();
        this.createData();
    }

    createNodes(): Node[] {
        return this.collection.people.getAll().map((p: Person) => {
            return {
                id: p.id,
                label: p.getFullName(),
                group: p.family_id.toString(),
                /*color: {
                    background: p.gender == "male" ? "#97C2FC" : "#fc9281",
                }*/
            }
        })
    }

    createEdges(): Edge[] {
        return this.collection.relationships.getAll().map((r: Relationship) => {
            return {
                from: r.from,
                to: r.to,
                arrows: r.mutual ? "to,from" : "to",
                label: r.type.name.toString(),
                font: {align: "middle"},
            }
        })
    }

    createFamilies(): void {
        this.collection.clear();
        for (let i = 0; i < this.options.familyCount; i++) {

            let nationality = this.options.nationalities[Math.floor(Math.random() * this.options.nationalities.length)];

            let country = this.options.countries[Math.floor(Math.random() * this.options.countries.length)];


            const FamilyIsSingle = (this.options.singleProbability > Math.random() * 100) && this.options.singles;
            let family = new Family();
            if (FamilyIsSingle) {
                let person = new Person({nationality: nationality, country: country});
                family.add(person);
                this.collection.people.add(person);
            } else {
                let children: Person[] = [];
                let relationships: Relationship[] = [];
                let person1 = new Person({
                    gender: "male",
                    nationality: nationality,
                    country: country
                });
                let person2 = new Person({
                    gender: "female",
                    surname: person1.surname,
                    nationality: nationality,
                    country: country
                });
                let relationship = new Relationship({
                    from: person1.id,
                    to: person2.id,
                    type: relationshipTypes.find((r: RelationshipType) => r.id === "spouse")
                });
                person1.addRelationShip(relationship);
                relationships.push(relationship);

                const childCount = this.options.minChildren + Math.round(Math.random() * this.options.maxChildren);
                for (let i = 0; i < childCount; i++) {
                    const age = ~~(Math.random() * 18);
                    let child = new Person({
                        age: age,
                        surname: person1.surname,
                        nationality: nationality,
                        country: country
                    });
                    let rel1 = new Relationship({
                        from: person1.id,
                        to: child.id,
                        type: relationshipTypes.find((r: RelationshipType) => r.id === "father"),
                    });
                    let rel2 = new Relationship({
                        from: person2.id,
                        to: child.id,
                        type: relationshipTypes.find((r: RelationshipType) => r.id === "mother"),
                    });
                    person1.addRelationShip(rel1);
                    person2.addRelationShip(rel2);
                    relationships = [...relationships, rel1, rel2];
                    children.push(child);
                }
                family.addMultiple([person1, person2, ...children]);


                this.collection.relationships.addMultiple(relationships);
                this.collection.people.addMultiple([...children, person2, person1]);
            }
            this.collection.families.add(family);
        }
    }

    generateRelationships() {
        let people = this.collection.people.getAll();
        people.forEach((p: Person) => {
            let relationShipCount = this.options.minRelationship + Math.round(Math.random() * this.options.maxRelationship);
            for (let i = 0; i < relationShipCount; i++) {
                let target = this.collection.people.getRandom();
                let noRelationships = relationshipTypes.filter((r: RelationshipType) => r.probability !== 0 && r.type === "social").length === 0;
                if (target.relationShips.length >= this.options.maxRelationship || target.family_id === p.family_id || noRelationships) return;
                let rel = new Relationship({from: p.id, to: target.id});
                p.addRelationShip(rel);
                target.addRelationShip(rel);
                this.collection.relationships.add(rel);
            }
        })
    }


    updateGraph = () => {
        this.createFamilies();
        this.generateRelationships();
        this.updateData();
    };

    updateData() {
        this.createData();
        //this.network.setData(this.data);
    };


    async createData() {
        const nodes = this.createNodes();
        const edges = this.createEdges();
        // @ts-ignore0
        let nodesDataset = new DataSet(nodes);
        // @ts-ignore
        let edgesDataset = new DataSet(edges);
        let data = {
            nodes: nodes,
            edges: edges
        };
        //console.log(data);
        await this.setState({data: data, nodes: nodesDataset, edges: edgesDataset});
        console.log('done');
    }

    componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>, snapshot?: any): void {
        console.log()
    }


    updateFamilyCount = (e: string): any => this.options.familyCount = parseInt(e);
    updateMinChild = (e: string): any => {
        let val: number = parseInt(e);
        if (this.options.maxChildren <= val) {
            this.options.maxChildren = val;
        }
        this.options.minChildren = val;
    };
    updateMaxChild = (e: string): any => {
        let val: number = parseInt(e);
        if (this.options.minChildren >= val) {
            this.options.minChildren = val;
        }
        this.options.maxChildren = val;
    };
    updateMinRel = (e: string): any => this.options.minRelationship = parseInt(e);
    updateMaxRel = (e: string): any => this.options.maxRelationship = parseInt(e);
    updateSingles = (e: string): any => this.options.singleProbability = parseInt(e);
    updateNationalities = (e: string[]): any => {
        this.options.nationalities = e;
    };

    updateCountries = (e: string[]): any => {
        this.options.countries = e;
    };

    getPerson = (e: any) => {
        let person = this.collection.people.findPersonByID(e.nodes[0]);
        this.setState({selected: person});
        console.log(person);
    };


    render() {
        return (
            <>
                <div className={"sidebar"}>
                    <ParameterGroup name={"General Parameters"}>
                        <Slider name={"Families"} min={1} max={50} identifier={"families"} active={true}
                                value={this.options.familyCount}
                                onChange={this.updateFamilyCount}/>
                        <Slider name={"Singles %"} min={1} max={100} identifier={"singles"} active={true}
                                value={this.options.singleProbability}
                                onChange={this.updateSingles}/>
                        <Dropdown name={'Nationality'} pluralName={"Nationalities"}
                                  list={this.nationalities}
                                  getValue={this.updateNationalities}/>
                        <Dropdown name={'Country'} pluralName={"Countries"} list={this.countries}
                                  getValue={this.updateCountries}/>
                    </ParameterGroup>
                    <ParameterGroup name={"Family Parameters"}>
                        <Slider name={"Children Min"} min={1} max={10} identifier={"minChildren"} active={true}
                                value={this.options.minChildren} onChange={this.updateMinChild}/>
                        <Slider name={"Children Max"} min={1} max={10} identifier={"maxChildren"} active={true}
                                value={this.options.maxChildren} onChange={this.updateMaxChild.bind(this)}/>
                    </ParameterGroup>
                    <ParameterGroup name={"Relationship Parameters"}>
                        <Slider name={"Relationships Min"} min={1} max={10} identifier={"minRelationships"}
                                active={true} value={this.options.minRelationship} onChange={this.updateMinRel}/>
                        <Slider name={"Relationships Max"} min={1} max={10} identifier={"maxRelationships"}
                                active={true} value={this.options.maxRelationship} onChange={this.updateMaxRel}/>
                        <ParameterGroup name={"Finetune relations"}>
                            {relationshipTypes.filter((r: RelationshipType) => r.type === "social").map((r: RelationshipType) => {
                                return <Slider name={r.name} min={1} max={100} identifier={r.id} active={false}
                                               key={r.id} value={r.probability * 10} onChange={this.updateFamilyCount}/>
                            })}
                        </ParameterGroup>
                    </ParameterGroup>
                    <input type={"button"} value={"Update"} onClick={this.updateGraph}/>
                </div>
                {this.state.data &&
                <Graph graph={this.state.data} identifier={"socialNetwork"} style={{width: "100%", height: "100%"}}
                       options={{
                           nodes: {
                               shape: "box",
                               scaling: {
                                   min: 10,
                                   max: 30,
                                   label: {
                                       min: 8,
                                       max: 30,
                                       drawThreshold: 5,
                                       maxVisible: 20
                                   }
                               }
                           }, edges: {
                               width: 0.15,
                               color: {inherit: "from"},
                               smooth: {
                                   type: "horizontal"
                               }, scaling: {
                                   min: 10,
                                   max: 30,
                                   label: {
                                       min: 8,
                                       max: 30,
                                       drawThreshold: 10,
                                       maxVisible: 30
                                   }
                               },
                           }, physics: false,
                       }} events={{"click": this.getPerson}}/>}
                <div className={"sidebar"}>
                    <PersonInfo person={this.state.selected} collection={this.collection}/>
                </div>
            </>
        );
    }
}