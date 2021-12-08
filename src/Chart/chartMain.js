import React, {useState} from 'react';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import dataMapping from '../utility/dataMapping';
import arrayMapping from '../utility/arrayMapping'
import Button from '../UI/button'
import Wrapper from '../utility/Wrapper/wrapper';
import Modal from '../UI/modal';
import ChartDisplay from './chartDisplay'

import styles from './chartMain.module.css';
require('dotenv').config(); // CALEB ???

const ChartMain = (props) => {

    const [ticker, setTicker] = useState("");
    const [companyResults, setCompanyResults] = useState([]);
    const [emaLow, setEmaLow] = useState(0);
    const [emaHigh, setEmaHigh] = useState(0);
    const [equityTable, setEquityTable] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [modal, setModal] = useState(false);
    const [untouched, setUntouched] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [chartError, setChartError] = useState(false);  

     const clearSearchHandler = () => {
        setTicker("")
        setCompanyResults([])
        setEmaLow(0);
        setEmaHigh(0);
        setEquityTable([]);
        setShowChart(false);
        setModal(false);
        setUntouched(false);
        setSearchError(false);
        setChartError(false);
    }

    const tickerSearchHandler = async event => {
        event.preventDefault()
        setShowChart(false);
        setUntouched(false);
        setSearchError(false);
        
        let keyword = event.target.tickerSymbol.value.toUpperCase();

        if (!keyword) {
            setUntouched(true);
            return;
        } // 
        let apiEndpoint = "https://pure-ridge-03326.herokuapp.com/symbol/stocksymbol?keyword=" + keyword

        let response = await fetch(apiEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(err => console.log(err))

        const data = await response.json();

        if (data.bestMatches.length === 0) {
            setSearchError(true);
            return;
        } 
        const matches = arrayMapping(data.bestMatches)
        setCompanyResults(matches);
        // setShowForm(false);
    }
 
    const priceHandler = async (event, listSymbol) => {
        event.preventDefault();
        setShowChart(false);
        setUntouched(false);
        setChartError(false);

        let symbol = listSymbol;
        let EMAHigh = 20;
        let EMALow = 10;
        let interval = 'daily';
        if (!listSymbol) {
            symbol = event.target.equitySymbol.value.toUpperCase();
            EMALow = event.target.lowEMAInterval.value;
            EMAHigh = event.target.highEMAInterval.value;
            interval = event.target.interval.value;
        };  
        
        if (!symbol) {
            setUntouched(true);
            return;
        }
// 
        let priceEndpoint = "https://pure-ridge-03326.herokuapp.com/chartdata?symbol=" + symbol + "&interval=" + interval

        let response = await fetch(priceEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).catch(err => console.log(err))

        let fullData = await response.json()
        if (fullData['Error Message']) {
            setChartError(true);
            return;
        }
        let priceData = fullData["Time Series (Daily)"];
        if (!fullData["Time Series (Daily)"]) {
            priceData = fullData['Weekly Adjusted Time Series']; 
        }
        
        const dataTable = dataMapping(priceData);
        setTicker(fullData["Meta Data"]["2. Symbol"]);
        setCompanyResults([]);
        setEmaLow(EMALow);
        setEmaHigh(EMAHigh);
        setEquityTable(dataTable);
        setShowChart(true);
        // setShowForm(false);
        return;
    }

    const buyHandler = async () => {
        let symbol = ticker;
        let lots =  100;
        let date = equityTable[equityTable.length-1]['date'];
        let value = equityTable[equityTable.length-1]['price'];
        let user = sessionStorage.getItem('userId');
        let investmentEndpoint = 'https://pure-ridge-03326.herokuapp.com/myinvestments/add'

        let response = await fetch(investmentEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: symbol,
                lots: lots,
                date: date,
                value: value,
                userId: user
            })
        }).catch(err => console.log(err))

        const data = await response.json();
        setModal(true);
    }

    const handleLogout = () => {
        props.history.push('/logout');
    };

    const handleModal = () => {
        setModal(false);
    }


    const symbolResults = companyResults.map(element => {
        return <div key={element["1. symbol"]}>
                <h3>{element["1. symbol"]}</h3>
                <p>{element["2. name"]}</p>
                <Button type='submit' clicked={event => priceHandler(event, element["1. symbol"])}>Chart it</Button>
                </div>
    });

    const formSymbol = 
        <Formik
            initialValues={{tickerSymbol: ""}}
            validationSchema={Yup.object({tickerSymbol: Yup.string().required('Symbol Required')})}
            onSubmit={() => {
                tickerSearchHandler()
            }}
        >
            <Form onSubmit={tickerSearchHandler} className={styles.symbolForm}>
                <label>Search for a Stock Symbol</label>
                <Field name="tickerSymbol" type="text" className={styles.field}/>
                <ErrorMessage name="tickerSymbol" render={msg => <div className={styles.error}>{msg}</div>}/>
                <Button type="submit" >Search</Button>
            </Form>
        </Formik>;

    const formCustom = 
        <Formik
            initialValues={{equitySymbol: "", lowEMAInterval: 10, highEMAInterval: 20, interval: "daily"}}
            validationSchema={Yup.object(
                {
                    equitySymbol: Yup.string().required('Symbol Name Required'), 
                    lowEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"),
                    highEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"),
                })}
            onSubmit={event => {
                priceHandler();
            }}
        >
            <Form onSubmit={priceHandler} className={styles.chartForm}>
            <ErrorMessage name="equitySymbol" render={msg => <div className={styles.error}>{msg}</div>} />
            
                
                <label htmlFor="equitySymbol">Already know the symbol?</label>
                <Field name="equitySymbol" type="text" className={styles.field}/>

                <label htmlFor="lowEMAInterval">Enter the shorter EMA interval: </label>
                <Field name="lowEMAInterval" type="number" className={styles.field} />

                <label htmlFor="highEMAInterval">Enter the longer EMA interval: </label>
                <Field name="highEMAInterval" type="number" className={styles.field} />

                <label htmlFor="interval">Interval Period</label>
                <Field name="interval" as="select" className={styles.field}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </Field>

                <Button type="submit" >Chart it!</Button>
            </Form>
        </Formik>;
    
    let chartDisplay;
    
    if (showChart) {
        chartDisplay = <ChartDisplay dataTable={equityTable} emaLow={emaLow} emaHigh={emaHigh} ticker={ticker}/>
       
    }

    return (
        <Wrapper>
            {modal ? <Modal title='Success!' message={`You bought ${ticker} stock for $${equityTable[equityTable.length-1]['price']}`} onConfirm={handleModal}></Modal> : null}
            <div id={styles.chartMain} >
                <div className={styles.chartContent}>
                    <div className={styles.symbolFormContainer}>
                        {untouched ? <div className={styles.error}>Symbol Required</div>: null}
                        {searchError ? <div className={styles.error}>No Results found</div>: null}
                        {!showChart ? formSymbol : null}    
                    </div>
                    <div className={styles.companyResultsContainer}>
                        {companyResults && !showChart ? symbolResults : null}
                    </div>
                    <div className={styles.chartFormContainer}>
                        {untouched ? <div className={styles.error}>Symbol Required</div>: null}
                        {chartError ? <div className={styles.error}>Symbol not found</div>: null}
                        
                        {!showChart  ? formCustom : null}
                    </div>
                    <div className={styles.chartContainer}>
                        {chartDisplay}
                    </div>
                </div>
                <div className={styles.chartNav}>
                    <h2 className={styles.introTitle}>Welcome to Chart the Market</h2>
                    <p className={styles.intro}>On the left either search for a stock symbol by company name or if you already know the symbol, then enter it, pick your moving averages and click Chart.</p>
                    <Button type="submit"  clicked={event => props.history.push('/investments')} >Your portfolio</Button>
                    {showChart ? <Button type="submit" clicked={buyHandler} >Buy this stock!</Button> : null}
                    <Button type="submit" clicked={clearSearchHandler} >Reset</Button>
                    {sessionStorage.getItem('userId') ? <Button clicked={handleLogout} >Logout</Button> : <Button clicked={event => props.history.push('/auth')} >Sign in</Button>}
                </div>  
            </div>
        </Wrapper>
    )
}

export default ChartMain;