import React, {useState, useEffect} from 'react';
import InvestmentCard from './investmentCard'
import investmentMath from '../utility/investmentMath';
import Button from '../UI/button';
import Modal from '../UI/modal';
import TrackRecord from './trackRecord';
import styles from './investments.module.css'

const investmentMainStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap' ,
    alignItems: 'center',
    justifyContent: 'space-between',
};

const Investments = (props) => {

    const [investmentsArray,setInvestmentsArray] = useState([]);
    const [portfolioData,setPortfolioData] = useState([]);
    const [returnsChartData,setReturnsChartData] = useState([]);
    const [modal,setModal] = useState(false)
    const [toDateReturn,setToDateReturn] = useState(0);
    const [toDateProfit,setToDateProfit] = useState(0);
    const [modalMessage, setModalMessage] = useState();
    const [modalTitle, setModalTitle] = useState();
    const [investmentQuotes, setInvestmentQuotes] = useState([])
    
    useEffect(() => {
        if (!sessionStorage.getItem('userId') && props.history) {
            props.history.push('/auth');
        }
        getInvestmentsHandler();
        getSalesHandler();
        // CALEB - create a handler for getting quotes using async await and try catch stement (guess)

    },[investmentsArray])

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

    const quoteHandler = async symbol => {
        const latestPriceEndpoint = 'https://pure-ridge-03326.herokuapp.com/myinvestments/saleprice'
        let latestPrice = await fetch(latestPriceEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({symbol: symbol})
        }).catch(err => console.log(err))

        let lastClose = await latestPrice.json()
        console.log("last close ", lastClose)
        // CALEB - handle 'non-errors' here!!!!!!!!!!!!
    }
// CALEB - Did you test sellHandler 1/13??
    const sellHandler = async (id, purchasePrice, symbol, event) => {
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
        console.log("theDATA:: ", data)

        const latestPriceEndpoint = 'https://pure-ridge-03326.herokuapp.com/myinvestments/saleprice'
        let latestPrice = await fetch(latestPriceEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({symbol: symbol})
        }).catch(err => console.log(err))

        let lastClose = await latestPrice.json();
        
        const allSaleEndpoint = 'https://pure-ridge-03326.herokuapp.com/sale/'

        let postSale = await fetch(allSaleEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: symbol,
                lots: 100,
                date: lastClose['Global Quote']['07. latest trading day'],
                buyPrice: purchasePrice,
                sellPrice: lastClose['Global Quote']['08. previous close'],
                userId: sessionStorage.getItem('userId')
            })
        }).catch(err => console.log(err))

        const result = await postSale.json();

        console.log("The Result: ", result, symbol)
        
        let {roi, profit} = investmentMath(purchasePrice, lastClose['Global Quote']['08. previous close'])

        
        setModalTitle(`${symbol} Stock Sold!`);
        setModalMessage(`You have sold ${symbol} stock for $${lastClose['Global Quote']['08. previous close']}, netting $${profit.toFixed()} per share or ${roi.toFixed()}%`);
        setModal(true);
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
        setPortfolioData(data.saleData)
        setReturnsChartData(data.chartReturns)
        statsHandler(data.saleData);
    }

    const statsHandler = (arr) => {
        let dollar = 0;
        let percentage = 0;
        
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
        setModalTitle();
        setModalMessage();
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

    let myInvestmentResults = [];
   

   if (myInvestmentsArray) {
    myInvestmentResults =  myInvestmentsArray.map(element => {
        return <InvestmentCard 
            key={element.id}
            purchaseDate={element.purchaseDate}
            purchasePrice={element.purchasePrice}
            clicked={event => sellHandler(element.id, element.purchasePrice, element.symbol, event)}> 
            {element.symbol}
        </InvestmentCard>
    });
}

    let portfolioReturns = []
    
    portfolioReturns = portfolioData.map(element => {
        return <div key={element._id}>
            <p>${element.equity} sold at ${element.sellPrice} on ${element.date}</p>
        </div>
        
    })
    

    return (
        <>
            {modal ? <Modal title={modalTitle } message={modalMessage} onConfirm={handleModal}></Modal> : null}
            <div style={investmentMainStyle}>
                <div className={styles.investResults}>
                    <div className={styles.title}>
                        <h5>Your Portfolio</h5> 
                    </div>
                    {investmentsArray.length === 0 ? <p>You have no Investments</p> : myInvestmentResults}
                </div>
                <div className={styles.line}></div>
                <div className={styles.investNav}>  
                    <TrackRecord dataTable={returnsChartData} percent={toDateReturn} dollars={toDateProfit}/>
                    <Button clicked={handleLogout}>Logout</Button>
                    <Button type='submit' clicked={event => props.history.push('/')}>Return to chart</Button>
                    {portfolioReturns}
                </div>
            </div>
        </>
    )
}

export default Investments;