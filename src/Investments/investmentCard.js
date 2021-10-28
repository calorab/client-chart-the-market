import React from 'react';
import Button from '../UI/button';
import './investmentCard.css';

const investmentCard = (props) => {

    return (
        <div className='investmentCard'>
            <h3 className='cardSymbol'>{props.children}</h3>
            <h5>Purchased on: {props.purchaseDate}</h5>
            <h5>Purchased at: ${props.purchasePrice}</h5>
            <Button type='submit' clicked={props.clicked}>Sell</Button>
        </div>
    )
};

export default investmentCard;