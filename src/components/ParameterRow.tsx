import React from 'react';

export interface ParameterRowProps {
    name: string;
    onCheckboxClick: any;
    initialActive?: boolean;
    children?: any;
    active?: boolean;
}

const ParameterRow = (props: ParameterRowProps) => {
    return (
        <div className={`paramContainer row ${props.active ? '' : 'disabled'}`}>
            <div className={"nameContainer cell"}>
                <input type={"checkbox"} defaultChecked={props.initialActive !== undefined ? props.initialActive : true}
                       onChange={props.onCheckboxClick}/>
                <label>{props.name}</label>
            </div>
            <div className={"inputContainer cell"}>
                {props.children}
            </div>
        </div>
    );
};

export default ParameterRow;