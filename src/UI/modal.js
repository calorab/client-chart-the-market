import React from 'react';

import Backdrop from './backdrop';
import Button from './button';
import Wrapper from '../utility/Wrapper/wrapper'
import './modal.css';

const Modal = (props) => {
  return (
    <Wrapper>
      <Backdrop />
      <div className='modal'>
        <header className='header'>
          <h2>{props.title}</h2>
        </header>
        <div className='content'>
          <p>{props.message}</p>
        </div>
        <footer className='actions'>
          <Button clicked={props.onConfirm}>Okay</Button>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Modal;