import React from 'react';
import ParameterRow from "./ParameterRow";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import {faAngleUp, faAngleDown} from "@fortawesome/free-solid-svg-icons";
import onClickOutside from "react-onclickoutside";

interface DropdownProps {
    name: string;
    pluralName:string;
    list: any[];
    getValue: (value: string[]) => {};
}

interface DropdownState {
    active: boolean;
    listOpen: boolean;
    selected: string[];
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {


    constructor(props: DropdownProps) {
        super(props);
        this.state = {
            listOpen: false,
            active: true,
            selected: [this.props.list[0].toLowerCase()]
        };
        // @ts-ignore
        fontawesome.library.add(faAngleUp, faAngleDown);
    }

    check = (e: any) => {
        this.setState({active: !this.state.active})
    };

    handleClickOutside = (evt:any) => {
        this.setState({
            listOpen: false
        })
    };

    toggleList() {
        this.setState(prevState => ({
            listOpen: !prevState.listOpen
        }))
    }

    setActive = (e: any) => {
        const selected: string = e.target.getAttribute('data-key').toLowerCase();
        //console.log(selected);
        let selectedState: string[] = this.state.selected;
        if (selectedState.includes(selected)) {
            selectedState = selectedState.filter(e => e !== selected)
        } else {
            selectedState.push(selected);
        }
        this.setState({selected: selectedState});
        this.props.getValue(selectedState)
    };

    render() {
        const {list} = this.props;
        const {listOpen} = this.state;
        return (
            <ParameterRow name={this.props.name} onCheckboxClick={this.check} active={this.state.active}>
                <div className="dd-wrapper">
                    <div className="dd-header" onClick={() => this.toggleList()}>
                        <div
                            className="dd-header-title">{this.state.selected.length === 1 ? this.state.selected[0] : this.state.selected.length > 1 ? `${this.state.selected.length} ${this.props.pluralName}` : "Please select one"}</div>
                        {listOpen
                            ? <FontAwesomeIcon icon={'angle-up'}/>
                            : <FontAwesomeIcon icon={'angle-down'}/>
                        }
                    </div>
                    {listOpen && <ul className="dd-list">
                        {list.map((item: string) => (
                            <li className={`dd-list-item ${this.state.selected.map((s:string)=>s.toLowerCase()).includes(item) ? 'selected' : ''}`}
                                key={item.toLowerCase()} data-key={item.toLowerCase()}
                                onClick={this.setActive}>{item}</li>
                        ))}
                    </ul>}
                </div>
            </ParameterRow>
        )
    }
}

export default onClickOutside(Dropdown)