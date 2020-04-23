import React from 'react';
export interface SliderProps {
    name: string;
    min: number;
    max: number;
    value: number | number[];
    identifier: string;
    active: boolean;
    onChange: (a: any) => void;
}
interface SliderState {
    active: boolean;
    value: number | number[];
}
declare class Slider extends React.Component<SliderProps, SliderState> {
    constructor(props: SliderProps);
    check: (e: any) => void;
    sliderOnChange: (e: any) => void;
    render(): JSX.Element;
}
export default Slider;
