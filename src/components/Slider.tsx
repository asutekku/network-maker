import React from 'react';
import ParameterRow from "./ParameterRow";
import ReactSlider from "react-slider";

export interface SliderProps {
    name: string;
    min: number;
    max: number;
    value: number | number[];
    identifier: string;
    active: boolean;
    onChange: (a: any) => void
}

interface SliderState {
    active: boolean;
    value: number | number[];
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
        let val = e, max = this.props.max, min = this.props.min;
        let value = val > max ? max : val < min ? min : val;
        this.setState({value: val});
        this.props.onChange(val);
    };

    render() {
        return (
            <ParameterRow name={this.props.name} onCheckboxClick={this.check} active={this.state.active}
                          initialActive={this.state.active}>
                <ReactSlider className={`horizontal-slider ${Array.isArray(this.state.value) ? 'multi' : 'single'}`}
                             thumbClassName="slider-thumb"
                             trackClassName="slider-track"
                             renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                             max={this.props.max}
                             min={this.props.min}
                             value={this.state.value}
                             ariaValuetext={state => `Thumb value ${state.valueNow}`}
                             onChange={this.sliderOnChange}
                             disabled={!this.state.active}
                             pearling
                             minDistance={0}
                />
            </ParameterRow>
        );
    }
}

export default Slider;