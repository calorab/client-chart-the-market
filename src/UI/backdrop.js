import React from 'react';

const backdropStyle = {
    width: '100%',
    height: '100%',
    position: 'fixed',
    zIndex: '100',
    left: '0',
    top: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.651)',
};

const backdrop = (props) => (
    <div style={backdropStyle} onClick={props.clicked}></div>
);
 
export default backdrop;