import React from 'react';

const investmentCard = (props) => {

    return (
        <div className='investmentCard'>
            <h3>{props.children}</h3>
            <h5>Purchased on: {props.purchaseDate}</h5>
            <h5>Purchased at: ${props.purchasePrice}</h5>
            <h5>Latest Close: ${props.latestClose}</h5>
            <h5>Return%: {props.return}%</h5>
            <button type='submit' onClick={props.clicked}>Sell</button>
        </div>
    )
};

export default investmentCard;