/// <reference types="react" />
export interface ParameterRowProps {
    name: string;
    onCheckboxClick: any;
    initialActive?: boolean;
    children?: any;
    active?: boolean;
}
declare const ParameterRow: (props: ParameterRowProps) => JSX.Element;
export default ParameterRow;
