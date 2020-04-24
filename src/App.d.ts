import * as React from 'react';
import './assets/scss/App.scss';
import { PeopleCollection } from "./models/PeopleCollection";
import { Person } from "./models/Person";
import { DataGroup, DataItem, DataSet, Edge, Node } from "vis";
export interface AppProps {
}
interface AppState {
    nodes: DataSet<DataItem | DataGroup | Node | Edge> | undefined;
    edges: DataSet<DataItem | DataGroup | Node | Edge> | undefined;
    data: any;
    selected: Person | undefined;
}
interface AppOptions {
    familyCount: number;
    children: number[];
    minRelationship: number;
    maxRelationship: number;
    singleProbability: number;
    singles: boolean;
    nationalities: string[];
    countries: string[];
}
export default class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps);
    countries: string[];
    nationalities: string[];
    collection: PeopleCollection;
    options: AppOptions;
    componentDidMount(): void;
    createNodes(): Node[];
    createEdges(): Edge[];
    createFamilies(): void;
    generateRelationships(): void;
    updateGraph: () => void;
    updateData(): void;
    createData(): Promise<void>;
    componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>, snapshot?: any): void;
    updateFamilyCount: (e: number) => any;
    updateChildren: (e: number[]) => any;
    updateRelationships: (e: number[]) => any;
    updateSingles: (e: number) => any;
    updateNationalities: (e: string[]) => any;
    updateCountries: (e: string[]) => any;
    getPerson: (e: any) => void;
    setPersonByID: (e: number) => void;
    render(): JSX.Element;
}
export {};
