import React from 'react';

import styles from './spinner.module.css';

const spinner = () => (
    <div className={styles.lds-facebook}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default spinner;