import React from 'react';
import Backdrop from './backdrop';
import Button from './button';
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
    <>
      <Backdrop />
      <div style={modalStyle}>
        <header className={styles.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={styles.content}>
          <p>{props.message}</p>
        </div>
        <footer className={styles.actions}>
          <Button clicked={props.onConfirm} className={styles.okayButton}>Okay</Button>
        </footer>
      </div>
    </>
  );
};

export default Modal;