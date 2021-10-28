import React from 'react';
import './backdrop.css';

const backdrop = (props) => (
    <div className='backdrop' onClick={props.clicked}></div>
);

export default backdrop;