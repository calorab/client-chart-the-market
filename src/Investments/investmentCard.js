import React from 'react';
import Button from '../UI/button';
import './investmentCard.css';

const investmentCard = (props) => {

    return (
        <div className='investmentCard'>
            <h3>{props.children}</h3>
            <h5>Purchased on: {props.purchaseDate}</h5>
            <h5>Purchased at: ${props.purchasePrice}</h5>
            {/* <h5>Latest Close: ${props.latestClose}</h5>
            <h5>Return%: {props.return}%</h5> */}
            <Button type='submit' clicked={props.clicked}>Sell</Button>
        </div>
    )
};

export default investmentCard;