import { produceWithPatches } from 'immer';
import React from 'react';
import Wrapper from '../utility/Wrapper/wrapper'

const trackRecord = props => {
    return (
        <Wrapper>
            <h3>Track Record</h3>
            <p>To-date return (%): {props.percent.toFixed(2)}%</p>
            <p>To-Date profit ($): ${props.dollars.toFixed(2)}</p>
        </Wrapper>
    )
};

export default trackRecord;