import {Data, DataSet, Edge, Network, Node} from "vis";
import {PeopleCollection} from "./models/PeopleCollection";
import {Family} from "./models/Family";
import {Person} from "./models/Person";
import {Relationship, RelationshipType, relationshipTypes} from "./models/Relationship";
import {Relationships} from "./models/Relationships";

class SocialGenerator {
    private static collection = new PeopleCollection();
    public static network: Network;
    public static nodesDataset: DataSet<Node>;
    public static edgesDataset: DataSet<Edge>;
    public static data: Data;
    private static highlightActive = false;

    private static options = {
        familyCount: 10,
        minChildren: 0,
        maxChildren: 3,
        minRelationship: 0,
        maxRelationship: 2,
        singleProbability: 20,
        singles: true,
        nationality: "american"
    };

    public static main(): void {

        // Create families
        this.createFamilies();
        this.generateRelationships();
        this.createNetwork();
        this.setControls();
        this.createFineTunes("social");
    }

    private static createFamilies(): void {

        this.collection.clear();

        for (let i = 0; i < this.options.familyCount; i++) {

            const FamilyIsSingle = (this.options.singleProbability > Math.random() * 100) && this.options.singles;
            let family = new Family();
            if (FamilyIsSingle) {
                let person = new Person({nationality: this.options.nationality});
                family.add(person);
                this.collection.people.add(person);
            } else {
                let children: Person[] = [];
                let relationships: Relationship[] = [];
                let person1 = new Person({gender: "male", nationality: this.options.nationality});
                let person2 = new Person({
                    gender: "female",
                    surname: person1.surname,
                    nationality: this.options.nationality
                });
                let relationship = new Relationship({
                    from: person1.id,
                    to: person2.id,
                    type: relationshipTypes.find(r => r.id === "spouse")
                });
                person1.addRelationShip(relationship);
                relationships.push(relationship);

                const childCount = this.options.minChildren + Math.round(Math.random() * this.options.maxChildren);
                for (let i = 0; i < childCount; i++) {
                    const age = ~~(Math.random() * 18);
                    let child = new Person({age: age, surname: person1.surname, nationality: this.options.nationality});
                    let rel1 = new Relationship({
                        from: person1.id,
                        to: child.id,
                        type: relationshipTypes.find(r => r.id === "father"),
                    });
                    let rel2 = new Relationship({
                        from: person2.id,
                        to: child.id,
                        type: relationshipTypes.find(r => r.id === "mother"),
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

    private static createData() {
        const nodes = this.createNodes();
        const edges = this.createEdges();
        // @ts-ignore0
        this.nodesDataset = new vis.DataSet(nodes);
        // @ts-ignore
        this.edgesDataset = new vis.DataSet(edges);
        this.data = {
            nodes: this.nodesDataset,
            edges: this.edgesDataset
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
            },
            edges: {
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
            },
            physics: false,
        };
        const container = document.getElementById("socialNetwork");
        // @ts-ignore
        this.network = new vis.Network(container!, this.data, options);
        this.network.on("click", function (params: any) {
            SocialGenerator.neighbourhoodHighlight(params);
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
                let noRelationships = relationshipTypes.filter((r: RelationshipType) => r.probability !== 0 && r.type === "social").length === 0;
                if (target.relationShips.length >= this.options.maxRelationship || target.family_id === p.family_id || noRelationships) return;
                let rel = new Relationship({from: p.id, to: target.id});
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

        setListener("familyCountSlider", "input", (e: any) => {
            document.getElementById("familyCountAmount")!.innerText = e.target.value;
            this.options.familyCount = e.target.value;
        });

        setListener("singlesBox", "input", (e: any) => {
            this.options.singles = e.target.checked;
        });

        setListener("nationalityChange", "input", (e: any) => {
            console.log(e.target.value);
            this.options.nationality = e.target.value;
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
    }

    private static clusterByFamily() {
        this.network.setData(this.data);
        const families = this.collection.families.count();
        let clusterOptionsByData;
        for (let i = 0; i < families; i++) {
            let id = i;
            clusterOptionsByData = {
                joinCondition: (childOptions: any) => {
                    return childOptions.cid == id.toString(); // the color is fully defined in the node.
                },
                processProperties: (clusterOptions: any, childNodes: Node[], childEdges: Edge[]) => {
                    let totalMass = 0;
                    for (let i = 0; i < childNodes.length; i++) {
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

    private static createFineTunes(type: string) {
        const root = document.getElementById("finetuneSocial");
        let types = relationshipTypes.filter((r: RelationshipType) => r.type === type);
        types.forEach((r: RelationshipType) => {
            let label = document.createElement("label");
            let slider = document.createElement("input");
            let inputCheck = document.createElement("input");
            let valueinput = document.createElement('input');
            let nameContainer = document.createElement('div');
            let sliderContainer = document.createElement('div');
            let row = document.createElement('div');
            row.className = "sliderContainerRow";
            sliderContainer.className = "sliderContainer";
            nameContainer.className = "nameContainer";

            let initValue = (r.probability * 100).toString();

            label.textContent = `${r.name}`;
            slider.type = "range";
            slider.value = initValue;
            slider.max = "100";
            slider.min = "1";
            slider.className = "valueSlider";
            let id = r.id;
            slider.id = id;
            inputCheck.type = "checkbox";
            inputCheck.checked = true;

            valueinput.id = r.id + "_value";
            valueinput.value = initValue;
            valueinput.className = "valueInput";
            valueinput.type = "number";
            valueinput.min = "1";
            valueinput.max = "100";

            slider.addEventListener("input", (e: any) => {
                let value = e.target!.value;
                valueinput.value = value > 100 ? 100 : value < 0 ? 0 : value;
                let rt = relationshipTypes.find((r: RelationshipType) => r.id == id)!;
                rt.probability = parseInt(value) / 100;
            });

            valueinput.addEventListener("input", (e: any) => {
                let value = e.target!.value;
                slider.value = value > 100 ? 100 : value <= 1 ? 1 : value;
                valueinput.value = value > 100 ? 100 : value <= 1 ? 1 : value;
                let rt = relationshipTypes.find((r: RelationshipType) => r.id == id)!;
                rt.probability = parseInt(e.target!.value) / 100;
            });

            inputCheck.addEventListener("input", (e: any) => {
                let disabled = !e.target.checked;
                slider.disabled = disabled;
                valueinput.disabled = disabled;
                if (disabled){
                    row.classList.add("disabled");
                } else {
                    row.classList.remove("disabled");
                }
                let rt = relationshipTypes.find((r: RelationshipType) => r.id == id)!;
                rt.enabled = !disabled;
            });

            nameContainer.appendChild(inputCheck);
            nameContainer.appendChild(label);
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(valueinput);
            row.appendChild(nameContainer);
            row.appendChild(sliderContainer);
            root!.appendChild(row);
        })
    }

    private static neighbourhoodHighlight(params: any) {
        // if something is selected:

        let allNodes: any[] = this.nodesDataset.get({returnType: "Object"});
        if (params.nodes.length > 0) {
            this.highlightActive = true;
            let i, j;
            let selectedNode = params.nodes[0];
            let degrees = 2;

            // mark all nodes as hard to read.
            for (let nodeId in allNodes) {
                allNodes[nodeId].color = "rgba(200,200,200,0.5)";
                /*                if (allNodes[nodeId].hiddenLabel === undefined) {
                                    allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
                                    allNodes[nodeId].label = undefined;
                                }*/
            }
            let connectedNodes: any[] = SocialGenerator.network.getConnectedNodes(selectedNode);
            let allConnectedNodes: any[] = [];

            // get the second degree nodes
            for (i = 1; i < degrees; i++) {
                for (j = 0; j < connectedNodes.length; j++) {
                    allConnectedNodes = allConnectedNodes.concat(
                        SocialGenerator.network.getConnectedNodes(connectedNodes[j])
                    );
                }
            }

            // all second degree nodes get a different color and their label back
            for (i = 0; i < allConnectedNodes.length; i++) {
                allNodes[allConnectedNodes[i]].color = "rgba(150,150,150,0.75)";
                if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
                    allNodes[allConnectedNodes[i]].label =
                        allNodes[allConnectedNodes[i]].hiddenLabel;
                    allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
                }
            }

            // all first degree nodes get their own color and their label back
            for (i = 0; i < connectedNodes.length; i++) {
                allNodes[connectedNodes[i]].color = undefined;
                if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
                    allNodes[connectedNodes[i]].label =
                        allNodes[connectedNodes[i]].hiddenLabel;
                    allNodes[connectedNodes[i]].hiddenLabel = undefined;
                }
            }

            // the main node gets its own color and its label back.
            allNodes[selectedNode].color = undefined;
            if (allNodes[selectedNode].hiddenLabel !== undefined) {
                allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
                allNodes[selectedNode].hiddenLabel = undefined;
            }
        } else if (this.highlightActive === true) {
            // reset all nodes
            for (let nodeId in allNodes) {
                allNodes[nodeId].color = undefined;
                if (allNodes[nodeId].hiddenLabel !== undefined) {
                    allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
                    allNodes[nodeId].hiddenLabel = undefined;
                }
            }
            this.highlightActive = false;
        }

        // transform the object into an array
        let updateArray = [];
        for (let nodeId in allNodes) {
            if (allNodes.hasOwnProperty(nodeId)) {
                updateArray.push(allNodes[nodeId]);
            }
        }
        this.nodesDataset.update(updateArray);
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
                label: r.type.name.toString(),
                font: {align: "middle"},
            }
        })
    }
}

SocialGenerator.main();