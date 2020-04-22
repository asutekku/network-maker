import React from 'react';
interface DropdownProps {
    name: string;
    pluralName: string;
    list: any[];
    getValue: (value: string[]) => {};
}
interface DropdownState {
    active: boolean;
    listOpen: boolean;
    selected: string[];
}
declare class Dropdown extends React.Component<DropdownProps, DropdownState> {
    constructor(props: DropdownProps);
    check: (e: any) => void;
    handleClickOutside: (evt: any) => void;
    toggleList(): void;
    setActive: (e: any) => void;
    render(): JSX.Element;
}
declare const _default: import("react-onclickoutside").WrapperClass<DropdownProps, typeof Dropdown>;
export default _default;
