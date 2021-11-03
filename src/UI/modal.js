import React from 'react';

import Backdrop from './backdrop';
import Button from './button';
import Wrapper from '../utility/Wrapper/wrapper'
import styles from '../UI/modal.module.css';

const modalStyle = {
  position: 'fixed',
  top: '30vh',
  left: '10%',
  width: '80%',
  zIndex: '110',
  overflow: 'hidden',
  backgroundColor: 'white',
};
 
const Modal = (props) => {
  return (
    <Wrapper>
      <Backdrop />
      <div style={modalStyle}>
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