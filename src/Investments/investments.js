import React, {useState, useEffect} from 'react';
import InvestmentCard from './investmentCard'
import investmentMath from '../utility/investmentMath';
import Button from '../UI/button';
import Modal from '../UI/modal';
import TrackRecord from './trackRecord';
import styles from './investments.module.css'
require('dotenv').config(); // CALEB dig into this for endpoint simplicity

const investmentMainStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap' ,
    alignItems: 'center',
    justifyContent: 'space-between',
};

const Investments = (props) => {

    const [investmentsArray,setInvestmentsArray] = useState([]);
    const [soldSymbol,setSoldSymbol] = useState('');
    const [saleData,setSaleData] = useState({});
    const [roi,setRoi] = useState(0);
    const [profit,setProfit] = useState(0);
    const [modal,setModal] = useState(false)
    const [toDateReturn,setToDateReturn] = useState(0);
    const [toDateProfit,setToDateProfit] = useState(0);

    useEffect(() => {
        if (!sessionStorage.getItem('userId') && props.history) {
            props.history.push('/auth');
        }
        getInvestmentsHandler();
        getSalesHandler();
    },[saleData])

    const getInvestmentsHandler = async () => {
        const investmentEndpoint = 'https://pure-ridge-03326.herokuapp.com/myinvestments';
        let response = await fetch(investmentEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId')})
        }).catch(err => console.log(err))

        const data = await response.json();
        setInvestmentsArray(data);
    }

    const sellHandler = async (id, purchasePrice, symbol,  event) => {
        event.preventDefault();
        const saleEndpoint = 'https://pure-ridge-03326.herokuapp.com/myinvestments/sell';
        let response = await fetch(saleEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId'), investmentId: id})
        }).catch(err => console.log(err))

        const data = await response.json();
       
        const latestPriceEndpoint = 'https://pure-ridge-03326.herokuapp.com/myinvestments/saleprice'
        let latestPrice = await fetch(latestPriceEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({symbol: symbol})
        }).catch(err => console.log(err))

        let lastClose = await latestPrice.json();
        // CALEB - handle 'non-errors' here!!!!!!!!!!!!
        
        const allSaleEndpoint = 'https://pure-ridge-03326.herokuapp.com/sale/'

        let postSale = await fetch(allSaleEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: symbol,
                lots: 100,
                date: lastClose['date'],
                buyPrice: purchasePrice,
                sellPrice: lastClose['price'],
                userId: sessionStorage.getItem('userId')
            })
        }).catch(err => console.log(err))

        const result = await postSale.json();
        
        let {roi, profit} = investmentMath(purchasePrice, lastClose['price'])
        setSoldSymbol(symbol);
        setRoi(roi);
        setProfit(profit);
        setModal(true);
        setSaleData(lastClose);
    }

    const getSalesHandler = async () => {
        const getSaleEndpoint = 'https://pure-ridge-03326.herokuapp.com/sale/all';
        
        let response = await fetch(getSaleEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId')})
        }).catch(err => console.log('The salesHandler error: ', err))

        const data = await response.json();

        statsHandler(data);
    }

    const statsHandler = (arr) => {
        let dollar = 0;
        let percentage = 0;
        // CALEB - check math on adding percentages - is this the right output??
        for (let i=0; i<arr.length; i++) {
            let {roi, profit} = investmentMath(arr[i]['buyPrice'], arr[i]['sellPrice']);
            dollar += profit;
            percentage += roi;
        }
        setToDateReturn(percentage);
        setToDateProfit(dollar);
    };

    const handleLogout = () => {
        props.history.push('/logout');
    };

    const handleModal = () => {
        setModal(false);
    }

    let myInvestmentsArray = [];
    for (const element of investmentsArray) {
        myInvestmentsArray.push({
            id: element._id,
            symbol: element.equity,
            purchaseDate: element.date,
            purchasePrice: element.buyPrice,
        })
    }
// CALEB - is this displaying correctly when no investments???
    let emptyPortfolio = 
    <div>
        <h5>You have no Investments</h5>
        <p>Return to the main page to buy stocks and see them here!</p>
    </div>;
    let myInvestmentResults = [];
    if (myInvestmentsArray) {
        myInvestmentResults = myInvestmentsArray.map(element => {
            return <InvestmentCard 
                key={element.id}
                purchaseDate={element.purchaseDate}
                purchasePrice={element.purchasePrice}
                clicked={event => sellHandler(element.id, element.purchasePrice, element.symbol, event)}> 
                {element.symbol}
            </InvestmentCard>
        });
    }

    const sellMessage = `You have sold ${soldSymbol} stock for $${saleData.price}, netting $${profit.toFixed()} per share or ${roi.toFixed()}%`;

    return (
        <>
            {modal ? <Modal title={`${soldSymbol} Stock Sold!`} message={sellMessage} onConfirm={handleModal}></Modal> : null}
            <div style={investmentMainStyle}>
                <div className={styles.investResults}>
                    <div className={styles.title}>
                        <h5>Your Portfolio</h5> 
                    </div>
                    {myInvestmentResults}
                </div>
                <div className={styles.line}></div>
                <div className={styles.investNav}>  
                    <TrackRecord percent={toDateReturn} dollars={toDateProfit}/>
                    <Button clicked={handleLogout}>Logout</Button>
                    <Button type='submit' clicked={event => props.history.push('/')}>Return to chart</Button>
                </div>
            </div>
        </>
    )
}

export default Investments;