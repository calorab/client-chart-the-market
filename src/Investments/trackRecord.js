import { produceWithPatches } from 'immer';
import react from 'react';
import Wrapper from '../utility/Wrapper/wrapper'

const trackRecord = props => {
    return (
        <Wrapper>
            <h3>Track Record</h3>
            <p>To-date return (%): ${props.percent}</p>
            <p>To-Date profit ($): ${props.dollars}</p>
        </Wrapper>
    )
};

export default trackRecord;