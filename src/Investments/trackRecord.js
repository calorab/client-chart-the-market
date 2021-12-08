import React from 'react';

const trackRecord = props => {
    return (
        <>
            <h3>Track Record</h3>
            <p>To-date return (%): {props.percent.toFixed(2)}%</p>
            <p>To-Date profit ($): ${props.dollars.toFixed(2)}</p>
        </>
    )
};

export default trackRecord;