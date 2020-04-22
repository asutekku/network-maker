import { Component, Ref } from "react";
import { Edge, Node } from "vis";
interface GraphState {
    identifier: string | undefined;
    highlightActive: boolean;
}
interface GraphProps {
    graph: {
        nodes: Node[];
        edges: Edge[];
    };
    style?: {
        width: "100%";
        height: "100%";
    };
    getNetwork?: (networks: any) => {};
    getNodes?: (nodes: any) => {};
    getEdges?: (edges: any) => {};
    identifier?: any;
    options?: any;
    events?: any;
}
export declare class Graph extends Component<GraphProps, GraphState> {
    container: Ref<HTMLDivElement>;
    private edges;
    private nodes;
    private Network;
    constructor(props: GraphProps);
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: Readonly<GraphProps>, nextState: Readonly<GraphState>): boolean;
    neighbourhoodHighlight(params: any): void;
    componentDidUpdate(): void;
    patchEdges({ edgesRemoved, edgesAdded, edgesChanged }: {
        edgesRemoved: Edge[];
        edgesAdded: Edge[];
        edgesChanged: Edge[];
    }): void;
    patchNodes({ nodesRemoved, nodesAdded, nodesChanged }: {
        nodesRemoved: Node[];
        nodesAdded: Node[];
        nodesChanged: Node[];
    }): void;
    updateGraph(): void;
    render(): JSX.Element;
}
export {};
