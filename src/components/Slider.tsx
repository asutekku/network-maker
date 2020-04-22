import React from 'react';
import ParameterRow from "./ParameterRow";

export interface SliderProps {
    name: string;
    min: number;
    max: number;
    value: number;
    identifier: string;
    active: boolean;
    onChange: (a: string) => {}
}

interface SliderState {
    active: boolean;
    value: number;
}

class Slider extends React.Component<SliderProps, SliderState> {

    constructor(props: SliderProps) {
        super(props);
        this.state = {active: this.props.active, value: this.props.value}
    }

    check = (e: any) => {
        this.setState({active: !this.state.active})
    };

    sliderOnChange = (e: any) => {
        let val = e.target.value, max = this.props.max, min = this.props.min;
        let value = val > max ? max : val < min ? min : val;
        this.setState({value: val});
        this.props.onChange(val);
    };

    render() {
        return (
            <ParameterRow name={this.props.name} onCheckboxClick={this.check} active={this.state.active}
                          initialActive={this.state.active}>
                <input type={"range"} max={this.props.max} min={this.props.min} className={"valueSlider"}
                       id={this.props.identifier} disabled={!this.state.active} value={this.state.value}
                       onChange={this.sliderOnChange}/>
                <input type={"number"} max={this.props.max} min={this.props.min} className={"valueInput"}
                       id={`${this.props.identifier}_value`} disabled={!this.state.active}
                       value={this.state.value} onChange={this.sliderOnChange}/>
            </ParameterRow>
        );
    }
}

export default Slider;