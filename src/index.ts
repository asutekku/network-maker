import {Data, Edge, Network, Node} from "vis";
import {PeopleCollection} from "./models/PeopleCollection";
import {Family} from "./models/Family";
import {Person} from "./models/Person";
import {Relationship, FamilyRelationshipType} from "./models/Relationship";
import {surnames} from "./models/names";

class SocialGenerator {
    private static collection = new PeopleCollection();
    public static network: Network;
    public static data: Data;

    private static options = {
        familyCount: 10,
        minChildren: 0,
        maxChildren: 3,
        minRelationship: 0,
        maxRelationship: 2,
        singleProbability: 20,
        singles: true
    };

    public static main(): void {

        // Create families
        this.createFamilies();
        this.generateRelationships();
        this.createNetwork();
        this.setControls();
    }

    private static createFamilies(): void {

        this.collection.clear();

        for (let i = 0; i < this.options.familyCount; i++) {

            const FamilyIsSingle = this.options.singleProbability > Math.random() * 100;
            let family = new Family();
            if (FamilyIsSingle) {
                let person = new Person();
                family.add(person);
                this.collection.people.add(person);
            } else {
                let children: Person[] = [];
                let relationships: Relationship[] = [];
                let person1 = new Person({gender: "male"});
                let person2 = new Person({gender: "female", surname: person1.surname});
                let relationship = new Relationship(person1.id, person2.id, FamilyRelationshipType.spouse, true);
                person1.addRelationShip(relationship);
                relationships.push(relationship);

                const childCount = this.options.minChildren + Math.round(Math.random() * this.options.maxChildren);
                for (let i = 0; i < childCount; i++) {
                    const age = ~~(Math.random() * 18);
                    let child = new Person({age: age, surname: person1.surname});
                    let rel1 = new Relationship(person1.id, child.id, FamilyRelationshipType.father, false);
                    let rel2 = new Relationship(person2.id, child.id, FamilyRelationshipType.mother, false);
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

    private static createData() {
        const nodes = this.createNodes();
        const edges = this.createEdges();
        this.data = {
            nodes: nodes,
            edges: edges
        };
    }

    private static updateData() {
        this.createData();
        this.network.setData(this.data);
    }

    private static createNetwork(): void {
        this.createData();
        const options = {
            nodes: {
                shape: "box"
            },
            physics: true,
        };
        const container = document.getElementById("socialNetwork");
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

    private static generateRelationships() {
        let people = this.collection.people.getAll();
        people.forEach((p: Person) => {
            let relationShipCount = this.options.minRelationship + Math.round(Math.random() * this.options.maxRelationship);
            for (let i = 0; i < relationShipCount; i++) {
                let target = this.collection.people.getRandom();
                if (target.relationShips.length >= this.options.maxRelationship || target.family_id === p.family_id) return;
                let rel = new Relationship(p.id, target.id);
                p.addRelationShip(rel);
                target.addRelationShip(rel);
                this.collection.relationships.add(rel);
            }
        })
    }

    private static updateGraph() {
        this.createFamilies();
        this.generateRelationships();
        this.updateData();
    }

    private static setControls() {
        function setListener(id: string, listener: string, func: any): void {
            let element: any = document.getElementById(id);
            element.addEventListener(listener, func);
        }

        let GenerateGraph: HTMLButtonElement = <HTMLButtonElement>document.getElementById("generateGraph")!;
        let childrenMin: HTMLInputElement = <HTMLInputElement>document.getElementById("minChildren")!;
        let childrenMax: HTMLInputElement = <HTMLInputElement>document.getElementById("maxChildren")!;
        let familyCount: HTMLInputElement = <HTMLInputElement>document.getElementById("familyCount")!;

        setListener("minRelationship", "input", (e: any) => {
            this.options.minRelationship = e.target.value;
        });

        setListener("maxRelationship", "input", (e: any) => {
            this.options.maxRelationship = e.target.value;
        });

        setListener("singleSlider", "input", (e: any) => {
            document.getElementById("singleProbability")!.innerText = e.target.value;
            this.options.singleProbability = e.target.value;
        });

        GenerateGraph.addEventListener("click", () => {
            this.updateGraph()
        });

        childrenMax.addEventListener("input", (e: any) => {
            console.log(e.target.value)
            this.options.maxChildren = parseInt(e.target.value);
        });
        childrenMin.addEventListener("input", (e: any) => {
            this.options.minChildren = parseInt(e.target.value);
        });
        familyCount.addEventListener("input", (e: any) => {
            this.options.familyCount = parseInt(e.target.value);
        });


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
                /*color: {
                    background: p.gender == "male" ? "#97C2FC" : "#fc9281",
                }*/
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