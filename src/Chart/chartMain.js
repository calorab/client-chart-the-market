import React, {Component} from 'react';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
import dataMapping from '../utility/dataMapping';
import arrayMapping from '../utility/arrayMapping'
import Button from '../UI/button'

import '../Chart/ chartMain.css';
require('dotenv').config();

class ChartMain extends Component {

    state = {
        ticker: "",
        submitting: false,
        companyResults: [],
        emaLow: 0,
        emaHigh: 0,
        equityTable: [],
        showChart: false,
        showForm: true
    }   

    clearSearchHandler = () => {
        this.setState({ 
            ticker: "", 
            submitting: false, 
            companyResults: [],
            emaLow: 0,
            emaHigh: 0,
            equityTable: [],
            showChart: false,
            showForm: true
        })
    }

    tickerSearchHandler = async event => {
        event.preventDefault()

        this.setState({submitting: true, showChart: false})
        
        let keyword = event.target.tickerSymbol.value;
        let apiEndpoint = "https://pure-ridge-03326.herokuapp.com/symbol/stocksymbol?keyword=" + keyword

        let response = await fetch(apiEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(err => console.log(err))

        const data = await response.json();

        const matches = arrayMapping(data.bestMatches)

        this.setState({companyResults: matches, submitting: false, showForm: false})
    }

    priceHandler = async (event, listSymbol) => {
        event.preventDefault();
        this.setState({submitting: true, showchart: false});

        let symbol = listSymbol;
        let EMAHigh = 20;
        let EMALow = 10;
        let interval = 'daily';
        if (!listSymbol) {
            symbol = event.target.equitySymbol.value;
            EMALow = event.target.lowEMAInterval.value;
            EMAHigh = event.target.highEMAInterval.value;
            interval = event.target.interval.value;
        };        

        let priceEndpoint = "https://pure-ridge-03326.herokuapp.com/chartdata?symbol=" + symbol + "&interval=" + interval

        let response = await fetch(priceEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let fullData = await response.json()
        let priceData = fullData["Time Series (Daily)"];
        if (!fullData["Time Series (Daily)"]) {
            priceData = fullData['Weekly Adjusted Time Series']; 
        }
        
        const dataTable = dataMapping(priceData);

        this.setState({
            equityTable: dataTable, 
            ticker: fullData["Meta Data"]["2. Symbol"], 
            emaLow: EMALow, 
            emaHigh: EMAHigh, 
            showChart: true,
            submitting: false,
            spinner: false,
            companyResults: [],
            showForm: false
        })

        return;
    }

    buyHandler = async () => {
        let symbol = this.state.ticker;
        let lots =  100;
        let date = this.state.equityTable[this.state.equityTable.length-1]['date'];
        let value = this.state.equityTable[this.state.equityTable.length-1]['price'];
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
        })

        const data = await response.json();
        data ? console.log("Data") : console.log("no Data");
        // data recieved! Phase 2: send to state and display data (maybe in modal?)
        // console.log("the buy data: ", data)
    }

    handleLogout = () => {
        this.props.history.push('/logout');
    };

    render(props) {

        const symbolResults = this.state.companyResults.map(element => {
            return <div key={element["1. symbol"]}>
                    <h5>{element["1. symbol"]}</h5>
                    <p>{element["2. name"]}</p>
                    <Button type='submit' clicked={event => this.priceHandler(event, element["1. symbol"])}>Chart it</Button>
                    </div>
        });

        const formSymbol = 
            <Formik
                initialValues={{tickerSymbol: ""}}
                validationSchema={Yup.object({tickerSymbol: Yup.string().required('Required')})}
                onSubmit={() => {
                    this.tickerSearchHandler()
                }}
            >
                <Form onSubmit={this.tickerSearchHandler} className='symbolForm'>
                    <label>Search for a Ticker Symbol</label>
                    <Field name="tickerSymbol" type="text" />
                    <ErrorMessage name="tickerSymbol" />
                    <Button type="submit">Search</Button>
                </Form>
            </Formik>;

        const formCustom = 
            <Formik
                initialValues={{equitySymbol: "", lowEMAInterval: '', highEMAInterval: '', interval: "daily"}}
                validationSchema={Yup.object(
                    {
                        equitySymbol: Yup.string().required('Symbol Name Required'), 
                        lowEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"),
                        highEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"),
                    })}
                onSubmit={() => {
                    this.priceHandler()
                }}
            >
                <Form onSubmit={this.priceHandler} className='chartForm'>
                    <ErrorMessage name="equitySymbol" className='error'/>
                    
                    <label htmlFor="equitySymbol">Already know the symbol?</label>
                    <Field name="equitySymbol" type="text" className='field'/>

                    <label htmlFor="lowEMAInterval">Enter the shorter EMA interval: </label>
                    <Field name="lowEMAInterval" type="number" className='field' />

                    <label htmlFor="highEMAInterval">Enter the longer EMA interval: </label>
                    <Field name="highEMAInterval" type="number" className='field' />

                    <label htmlFor="interval">Interval Period</label>
                    <Field name="interval" as="select" className='field'>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </Field>
    
                    <Button type="submit">Chart</Button>
                </Form>
            </Formik>;

        // ----------  Anychart Table and Chart Config ----------
        // create table
        let dataTable = anychart.data.table('date');
        // add data
        dataTable.addData(this.state.equityTable);
        // mapAs
        let mapping = dataTable.mapAs({x: 'date', value: 'price'});
        // create chart
        let chart = anychart.stock();
        // add series
        let series = chart.plot(0).column(mapping);

        // --- technical indicators ---
        chart.plot(0).ema(mapping, this.state.emaLow, "line");
        chart.plot(0).ema(mapping, this.state.emaHigh, "line");
        chart.plot(1).macd(mapping); // need to change height to be smaller - 50% probs. ----  .height('50%') ... let macd_plot = 
        // ----- end technical indicators ---
        series.name(`${this.state.ticker}`);
        chart.container('chartContainer');
        // chart.draw();

            // {/* ChartWindow component needed for the graph? 
            //     anyChart links for later:
            //         https://github.com/AnyChart/AnyChart-React/ - React Plugin
            //         https://api.anychart.com/anychart.charts.Stock#category-specific-settings - Stock funcs for AnyChart
            //         https://www.alphavantage.co/documentation/ - AlphaVantage api Documentation

            // */}
            // 
        // ---------- End Anychart Config ----------
        let chartDisplay;
        
        if (this.state.showChart) {
            chartDisplay = <AnyChart
                id='chartContainer'
                width={800}
                height={600}
                instance={chart}
                title={`100-Day ${this.state.ticker} chart with EMA's of ${this.state.emaLow} & ${this.state.emaHigh}`}
            />;
        }

        return (
            <div id='chartMain' >
                <div className='chartContent'>
                    <div className='symbolFormContainer'>
                        {!this.state.showChart ? formSymbol : null}    
                    </div>
                    <div className='companyResultsContainer'>
                        {this.state.companyResults && !this.state.showChart ? symbolResults : null}
                    </div>
                    <div className='chartFormContainer'>
                        {this.state.showForm  ? formCustom : null}
                    </div>
                    <div className='chartContainer'>
                        {chartDisplay}
                    </div>
                </div>
                <div className='chartNav'>
                    <h2 className='introTitle'>Welcome to Chart the Market</h2>
                    <p className='intro'>On the left either search for a stock symbol by company name or if you already know the symbol, then enter it, pick your moving averages (default is 10 and 20 respectively) and click Chart.</p>
                    <Button type="submit"  clicked={event => this.props.history.push('/investments')} >Your portfolio</Button>
                    {this.state.showChart ? <Button type="submit" clicked={this.buyHandler} >Buy this stock!</Button> : null}
                    <Button type="submit" clicked={this.clearSearchHandler} >Reset</Button>
                    {sessionStorage.getItem('userId') ? <Button clicked={this.handleLogout} >Logout</Button> : <Button clicked={event => this.props.history.push('/auth')} >Sign in</Button>}
                </div>  
            </div>
            
            
        )
    }
}

export default ChartMain;