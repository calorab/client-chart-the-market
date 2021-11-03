import React from 'react';

import Backdrop from './backdrop';
import Button from './button';
import Wrapper from '../utility/Wrapper/wrapper'
import styles from '../UI/modal.module.css';
 
const Modal = (props) => {
  return (
    <Wrapper>
      <Backdrop />
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={styles.content}>
          <p>{props.message}</p>
        </div>
        <footer className={styles.actions}>
          <Button clicked={props.onConfirm}>Okay</Button>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Modal;