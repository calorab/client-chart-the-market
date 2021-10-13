import React from 'react';
import './button.css';

const button = (props) => (
    <button
    type={props.type}
    disabled={props.disabled}
    className='button'
    onClick={props.clicked}>{props.children}</button>
);

export default button;