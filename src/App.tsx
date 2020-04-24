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
import Div100vh from 'react-div-100vh'

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
    children: number[],
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

    countries: string[] = ['the united states', 'japan', 'finland', "italy"];
    nationalities: string[] = ["american", "japanese", "finnish", "italian"];

    collection: PeopleCollection = new PeopleCollection();
    options: AppOptions = {
        familyCount: 10,
        children: [0, 3],
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
        return this.collection.relationships.getAll().filter((r: Relationship) => r.type.display && r.type.enabled).map((r: Relationship) => {
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
            let parentAge = 18 + ~~(Math.random() * 60);
            if (FamilyIsSingle) {
                let person = new Person({nationality: nationality, country: country});
                family.add(person);
                this.collection.people.add(person);
            } else {

                let spouseAge = parentAge + (-5 + ~~(Math.random() * 10));
                let children: Person[] = [];
                let relationships: Relationship[] = [];
                let person1 = new Person({
                    gender: "male",
                    nationality: nationality,
                    country: country,
                    age: parentAge
                });
                let person2 = new Person({
                    gender: "female",
                    surname: person1.surname,
                    nationality: nationality,
                    country: country,
                    age: spouseAge
                });
                let relationship = new Relationship({
                    from: person1.id,
                    to: person2.id,
                    type: relationshipTypes.find((r: RelationshipType) => r.id === "spouse")
                });
                person1.addRelationShip(relationship);
                relationships.push(relationship);

                const childCount = this.options.children[0] + Math.round(Math.random() * this.options.children[1]);
                for (let i = 0; i < childCount; i++) {
                    const age = ~~(Math.random() * (parentAge - 16));
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
                    children.forEach((p: Person) => {
                        let sibling = new Relationship({
                            from: child.id,
                            to: p.id,
                            type: relationshipTypes.find((r: RelationshipType) => r.id === "sibling"),
                        });
                        p.addRelationShip(sibling);
                        relationships.push(sibling);
                    })
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
        this.setState({selected: undefined});
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


    updateFamilyCount = (e: number): any => this.options.familyCount = e;
    updateChildren = (e: number[]): any => {
        this.options.children = e;
    };
    updateRelationships = (e: number[]): any => {
        this.options.minRelationship = e[0];
        this.options.maxRelationship = e[1];
    };
    updateSingles = (e: number): any => this.options.singleProbability = e;
    updateNationalities = (e: string[]): any => {
        this.options.nationalities = e;
    };

    updateCountries = (e: string[]): any => {
        this.options.countries = e;
    };


    setPersonByID = (e: number | undefined) => {
        if (e) {
            let person = this.collection.people.findPersonByID(e);
            this.setState({selected: person});
        } else {
            this.setState({selected: undefined});
        }

    };

    getPerson = (e: any) => {
        let person = this.collection.people.findPersonByID(e.nodes[0]);
        this.setState({selected: person});
    };

    render() {
        return <>
            <Div100vh>
                <div className={'content'}>
                    <div className={"sidebar"} id={"parameters"}>
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
                            <Slider name={"Children"} min={0} max={10} identifier={"minChildren"} active={true}
                                    value={[this.options.children[0], this.options.children[1]]}
                                    onChange={this.updateChildren}/>
                        </ParameterGroup>
                        <ParameterGroup name={"Relationship Parameters"}>
                            <Slider name={"Relationships"} min={1} max={10} identifier={"minRelationships"}
                                    active={true} value={[this.options.minRelationship, this.options.maxRelationship]}
                                    onChange={this.updateRelationships}/>
                            <ParameterGroup name={"Finetune relations"}>
                                {relationshipTypes.filter((r: RelationshipType) => r.type === "social").map((r: RelationshipType) => {
                                    return <Slider name={r.name} min={1} max={100} identifier={r.id} active={false}
                                                   key={r.id} value={r.probability * 10}
                                                   onChange={this.updateFamilyCount}/>
                                })}
                            </ParameterGroup>
                        </ParameterGroup>
                        <div className={'button-container'}>
                            <input className={'button-wide'} type={"button"} value={"Update"}
                                   onClick={this.updateGraph}/>
                        </div>
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
                           }} events={{"click": this.getPerson}} selected={this.state.selected}/>}
                </div>
                <div className={`sidebar bio-container ${this.state.selected !== undefined ? '' : 'hidden'}`}>
                    <PersonInfo person={this.state.selected} collection={this.collection} onClick={this.setPersonByID}/>
                </div>
            </Div100vh>
        </>;
    }
}