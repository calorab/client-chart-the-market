import React from 'react';
import styles from '../UI/backdrop.module.css';

const backdrop = (props) => (
    <div id={styles.backdrop} onClick={props.clicked}></div>
);
 
export default backdrop;