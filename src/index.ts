import {Data, Edge, Network, Node} from "vis";
import {PeopleCollection} from "./models/PeopleCollection";
import {Family} from "./models/Family";
import {Person} from "./models/Person";
import {Relationship, RelationShipType} from "./models/Relationship";
import {surnames} from "./models/names";

class SocialGenerator {
    private static collection = new PeopleCollection();
    public static network: Network;
    public static data: Data;

    public static main(): void {

        for (let i = 0; i < 20; i++) {
            let family = new Family();
            let children: Person[] = [];
            let relationships: Relationship[] = [];
            let person1 = new Person({gender: "male"});
            let person2 = new Person({gender: "female", surname: person1.surname});
            let relationship = new Relationship(person1.id, person2.id, RelationShipType.spouse, true);
            person1.addRelationShip(relationship);
            relationships.push(relationship);

            const childCount = ~~(Math.random() * 5);
            for (let i = 0; i < childCount; i++) {
                const age = ~~(Math.random() * 18);
                let child = new Person({age: age, surname: person1.surname});
                let rel1 = new Relationship(person1.id, child.id, RelationShipType.father, false);
                let rel2 = new Relationship(person2.id, child.id, RelationShipType.mother, false);
                person1.addRelationShip(rel1);
                person2.addRelationShip(rel2);
                relationships = [...relationships, rel1, rel2];
                children.push(child);
            }
            family.addMultiple([person1, person2, ...children]);


            this.collection.relationships.addMultiple(relationships);
            this.collection.families.add(family);
            this.collection.people.addMultiple([...children, person2, person1]);
        }

        const families = this.collection.families.all();

        /*for (let i = 0; i < 100; i++) {
            let person = new Person();
            let family = families[~~(Math.random() * this.collection.families.count())];
            family.add(person);
            this.collection.people.add(person);
            if (this.collection.people.count() !== 0) {
                const people = this.collection.people.getAll();
                let randomPerson: Person = people[~~(Math.random() * people.length)];
                let relationship = new Relationship(person.id, randomPerson.id);
                this.collection.relationships.add(relationship);
            }
        }*/
        console.log(this.collection.people.getAll());
        this.createNetwork();
        this.setControls();
    }

    private static createNetwork(): void {
        const nodes = this.createNodes();
        const edges = this.createEdges();
        const container = document.getElementById("socialNetwork");
        this.data = {
            nodes: nodes,
            edges: edges
        };
        const options = {
            nodes: {
                shape: "box"
            },
            physics: true
        };
        // @ts-ignore
        this.network = new vis.Network(container!, this.data, options);
        this.network.on("click", function (params: any) {
            params.event = "[original event]";
            if (params.nodes.length == 1) {
                if (SocialGenerator.network.isCluster(params.nodes[0])) {
                    SocialGenerator.network.openCluster(params.nodes[0]);
                }
            }
        });
    }

    private static setControls() {
        let clusterButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("clusterFamilyButton")!;
        clusterButton.addEventListener("click", () => {
            this.clusterByFamily()
        })
    }

    private static clusterByFamily() {
        this.network.setData(this.data);
        const families = this.collection.families.count();
        let clusterOptionsByData;
        for (let i = 0; i < families; i++) {
            let id = i;
            clusterOptionsByData = {
                joinCondition: (childOptions: any) => {
                    console.log(childOptions);
                    return childOptions.cid == id.toString(); // the color is fully defined in the node.
                },
                processProperties: (clusterOptions: any, childNodes: Node[], childEdges: Edge[]) => {
                    var totalMass = 0;
                    for (var i = 0; i < childNodes.length; i++) {
                        totalMass += childNodes[i].mass!;
                    }
                    clusterOptions.mass = totalMass;
                    return clusterOptions;
                },
                clusterNodeProperties: {
                    borderWidth: 3,
                    shape: "database",
                    label: id.toString()
                }
            };
            this.network.cluster(clusterOptionsByData);
        }
    }

    private static createNodes(): Node[] {
        return this.collection.people.getAll().map((p: Person) => {
            return {
                id: p.id,
                label: p.getFullName(),
                group: p.family_id.toString(),
                cid: p.family_id,
                color: {
                    background: p.gender == "male" ? "#97C2FC" : "#fc9281"
                }
            }
        })
    }

    private static createEdges(): Edge[] {
        return this.collection.relationships.getAll().map((r: Relationship) => {
            return {
                from: r.from,
                to: r.to,
                arrows: r.mutual ? "to,from" : "to",
                label: r.type.toString(),
                font: {align: "middle"},
                color: "#2d2d2d"
            }
        })
    }
}

SocialGenerator.main();