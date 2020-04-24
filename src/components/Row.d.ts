/// <reference types="react" />
interface RowProps {
    title: string;
    values: any;
    link?: boolean;
    linkOnClick?: any;
}
declare const Row: (props: RowProps) => JSX.Element;
export default Row;
