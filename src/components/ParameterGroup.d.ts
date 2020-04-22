import React from 'react';
export interface ParameterGroupProps {
    name: string;
    children?: any;
}
interface ParamGroupState {
    closed: boolean;
}
declare class ParameterGroup extends React.Component<ParameterGroupProps, ParamGroupState> {
    constructor(props: ParameterGroupProps);
    handleClick: () => void;
    render(): JSX.Element;
}
export default ParameterGroup;
