import React from 'react';
import styles from './backdrop.module.css';

const backdrop = (props) => (
    <div className={styles.backdrop} onClick={props.clicked}></div>
);
 
export default backdrop;