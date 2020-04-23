import React from 'react';

interface RowProps {
    title: string;
    values: any;
    link?: boolean;
    linkOnClick?: any;
}

const Row = (props: RowProps) => {
    return (
        <div className={'row columns-2 dense'}>
            <div className={'cell bold major'}>{props.title}</div>
            <div className={`cell capitalize ${props.link ? 'link' : ''}`}
                 onClick={props.linkOnClick ? props.linkOnClick : null}>{props.values}</div>
        </div>
    );
};

export default Row;