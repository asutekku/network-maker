import React, {Component, Ref} from "react";
import {DataGroup, DataItem, DataSet, Edge, Network, NetworkEvents, Node} from "vis";
import defaultsDeep from "lodash/fp/defaultsDeep";
import differenceWith from "lodash/differenceWith";
import isEqual from "lodash/isEqual";
import uuid from "uuid";
import {Person} from "../models/Person";


interface GraphState {
    identifier: string | undefined;
    highlightActive: boolean;
}

interface GraphProps {
    graph: { nodes: Node[], edges: Edge[] },
    style?: { width: "100%", height: "100%" },
    getNetwork?: (networks: any) => {},
    getNodes?: (nodes: any) => {},
    getEdges?: (edges: any) => {},
    identifier?: any,
    options?: any
    events?: any
}

export class Graph extends Component<GraphProps, GraphState> {

    container: Ref<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private edges: DataSet<DataItem | DataGroup | Node | Edge> = new DataSet<DataItem | DataGroup | Node | Edge>();
    private nodes: DataSet<DataItem | DataGroup | Node | Edge> = new DataSet<DataItem | DataGroup | Node | Edge>();
    // @ts-ignore
    private Network: Network;

    constructor(props: GraphProps) {
        super(props);
        const {identifier} = props;
        this.updateGraph = this.updateGraph.bind(this);
        this.state = {
            identifier: identifier !== undefined ? identifier : "asd",
            highlightActive: false
        };
        this.container = React.createRef();
    }

    componentDidMount() {
        // @ts-ignore
        this.edges = new vis.DataSet();
        this.edges.add(this.props.graph.edges);
        // @ts-ignore
        this.nodes = new vis.DataSet();
        this.nodes.add(this.props.graph.nodes);
        this.updateGraph();
    }

    shouldComponentUpdate(nextProps: Readonly<GraphProps>, nextState: Readonly<GraphState>) {
        let nodesChange = !isEqual(this.props.graph.nodes, nextProps.graph.nodes);
        let edgesChange = !isEqual(this.props.graph.edges, nextProps.graph.edges);
        let optionsChange = !isEqual(this.props.options, nextProps.options);
        let eventsChange = !isEqual(this.props.events, nextProps.events);

        if (nodesChange) {

            const idIsEqual = (n1: Node, n2: Node) => n1.id === n2.id;
            const nodesRemoved: Node[] = differenceWith(this.props.graph.nodes, nextProps.graph.nodes, idIsEqual);
            const nodesAdded: Node[] = differenceWith(nextProps.graph.nodes, this.props.graph.nodes, idIsEqual);
            const nodesChanged: Node[] = differenceWith(
                differenceWith(nextProps.graph.nodes, this.props.graph.nodes, isEqual),
                nodesAdded
            );
            this.patchNodes({nodesRemoved, nodesAdded, nodesChanged});

        }

        if (edgesChange) {

            const edgesRemoved: Edge[] = differenceWith(this.props.graph.edges, nextProps.graph.edges, isEqual);
            const edgesAdded: Edge[] = differenceWith(nextProps.graph.edges, this.props.graph.edges, isEqual);
            const edgesChanged: Edge[] = differenceWith(
                differenceWith(nextProps.graph.edges, this.props.graph.edges, isEqual),
                edgesAdded
            );
            this.patchEdges({edgesRemoved, edgesAdded, edgesChanged});

        }

        if (optionsChange) {
            this.Network.setOptions(nextProps.options);
        }

        if (eventsChange) {
            let events = this.props.events || {};
            Object.keys(events).forEach((eventName: string) => this.Network.off(eventName as NetworkEvents, events[eventName]));

            events = nextProps.events || {};
            Object.keys(events).forEach((eventName: string) => this.Network.off(eventName as NetworkEvents, events[eventName]));
        }

        return false;
    }

    neighbourhoodHighlight(params: any) {
        let allNodes: any[] = this.nodes.get({returnType: "Object"});
        this.setState({highlightActive: false});
        if (params.nodes.length > 0) {
            this.setState({highlightActive: true});
            let i, j;
            let selectedNode = params.nodes[0];
            let degrees = 2;

            // mark all nodes as hard to read.
            for (let nodeId in allNodes) {
                allNodes[nodeId].color = "rgba(200,200,200,0.5)";
            }
            let connectedNodes: any[] = this.Network.getConnectedNodes(selectedNode);
            let allConnectedNodes: any[] = [];

            // get the second degree nodes
            for (i = 1; i < degrees; i++) {
                for (j = 0; j < connectedNodes.length; j++) {
                    allConnectedNodes = allConnectedNodes.concat(
                        this.Network.getConnectedNodes(connectedNodes[j])
                    );
                }
            }

            // all second degree nodes get a different color and their label back
            for (i = 0; i < allConnectedNodes.length; i++) {
                allNodes[allConnectedNodes[i]].color = "rgba(70,70,70,0.75)";
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
        } else {
            // reset all nodes
            for (let nodeId in allNodes) {
                allNodes[nodeId].color = undefined;
                if (allNodes[nodeId].hiddenLabel !== undefined) {
                    allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
                    allNodes[nodeId].hiddenLabel = undefined;
                }
            }
            this.setState({highlightActive: false});
        }

        // transform the object into an array
        let updateArray = [];
        for (let nodeId in allNodes) {
            if (allNodes.hasOwnProperty(nodeId)) {
                updateArray.push(allNodes[nodeId]);
            }
        }
        this.nodes.update(updateArray);
    }

    componentDidUpdate() {
        this.updateGraph();
    }

    patchEdges({edgesRemoved, edgesAdded, edgesChanged}: { edgesRemoved: Edge[], edgesAdded: Edge[], edgesChanged: Edge[] }) {
        this.edges.clear();
        this.edges.add(edgesAdded);
        this.updateGraph();
        //await this.edges.update(edgesChanged);
    }

    patchNodes({nodesRemoved, nodesAdded, nodesChanged}: { nodesRemoved: Node[], nodesAdded: Node[], nodesChanged: Node[] }) {
        this.nodes.clear();
        this.nodes.add(nodesAdded);
        this.updateGraph();
        //await this.nodes.update(nodesChanged);
    }

    updateGraph() {
        let cont = this;
        let defaultOptions = {
            physics: true,
            autoResize: false,
            edges: {
                smooth: false,
                color: "#000000",
                width: 0.5,
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.5
                    }
                }
            }
        };

        // merge user provied options with our default ones
        let options = defaultsDeep(defaultOptions, this.props.options);

        // @ts-ignore
        this.Network = new vis.Network(
            // @ts-ignore
            this.container.current,
            Object.assign({}, this.props.graph, {
                edges: this.edges,
                nodes: this.nodes
            }),
            options
        );


        if (this.props.getNetwork) {
            this.props.getNetwork(this.Network);
        }

        if (this.props.getNodes) {
            this.props.getNodes(this.nodes);
        }

        if (this.props.getEdges) {
            this.props.getEdges(this.edges);
        }

        // Add user provied events to network
        let events = this.props.events || {};
        for (let eventName of Object.keys(events)) {
            this.Network.on(eventName as NetworkEvents, events[eventName]);
        }
        this.Network.on("click", function (params: any) {
            cont.neighbourhoodHighlight(params);
        });
    }

    render() {
        return (<div id={this.state.identifier} ref={this.container} style={this.props.style}/>);

    }
}