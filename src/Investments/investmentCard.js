import React from 'react';
import Button from '../UI/button';
import styles from './investmentCard.module.css';

const investmentCardStyle = {
    margin: '20px auto',
    textAlign: 'center',
    boxShadow: '0 2px 3px rgb(0, 0, 0)',
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: 'rgb(175, 178, 179)'
};

const investmentCard = (props) => {
    return (
        <div style={investmentCardStyle}>
            <h3 className={styles.cardSymbol}>{props.children}</h3>
            <h5>Purchased on: {props.purchaseDate}</h5>
            <h5>Purchased at: ${props.purchasePrice}</h5>
            <h5>Latest Close: ${props.currentPrice}</h5>
            <Button type='submit' clicked={props.clicked}>Sell</Button>
        </div>
    ) 
};
  
export default investmentCard;