import React from 'react';
import styles from './button.module.css';

const button = (props) => (
    <button
    type={props.type}
    disabled={props.disabled}
    className={styles.button}
    onClick={props.clicked}>{props.children}</button>
);

export default button;