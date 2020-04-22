import React from 'react';

export interface ParameterGroupProps {
    name: string;
    children?: any;
}

interface ParamGroupState {
    closed: boolean;
}

class ParameterGroup extends React.Component<ParameterGroupProps, ParamGroupState> {

    constructor(props: ParameterGroupProps) {
        super(props);
        this.state = {closed: false}
    }

    handleClick = () => {
        let closed = this.state.closed;
        this.setState({closed: !closed})
    };

    render() {


        return (
            <div className={'group-container'}>
                <div className={'group-title'} onClick={this.handleClick}>{this.props.name}</div>
                <div className={`rows${this.state.closed ? ' hidden' : ''}`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default ParameterGroup;