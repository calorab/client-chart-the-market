import React, {Component} from 'react';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
import dataMapping from '../utility/dataMapping';
import Investments from '../Investments/investments';
// import Spinner from '../spinner/spinner';

class ChartMain extends Component {

    state = {
        ticker: "",
        submitting: false,
        companyResults: [],
        emaLow: 0,
        emaHigh: 0,
        equityTable: [],
        showChart: false
    }   

    clearSearchHandler = () => {
        this.setState({ 
            ticker: "", 
            submitting: false, 
            companyResults: [],
            emaLow: 0,
            emaHigh: 0,
            equityTable: [],
            showChart: false
        })
    }

    tickerSearchHandler = async event => {
        event.preventDefault()

        this.setState({submitting: true})
        
        let keyword = event.target.tickerSymbol.value;
        let apiEndpoint = "http://localhost:8000/symbol/stocksymbol?keyword=" + keyword

        let response = await fetch(apiEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const matches = await response.json();

        this.setState({companyResults: matches.bestMatches, submitting: false})
    }

    priceHandler = async (event, listSymbol) => {
        event.preventDefault();
        this.setState({submitting: true, showchart: false});

        let symbol = listSymbol;
        if (!listSymbol) {
            symbol = event.target.equitySymbol.value;
        };
        // console.log(symbol);
        let EMALow = event.target.lowEMAInterval.value || 10;
        let EMAHigh = event.target.highEMAInterval.value || 20;

        let interval = event.target.interval.value 
        // for below when weekly data issue resolved... : + "&interval=" + interval
        let priceEndpoint = "http://localhost:8000/chartdata?symbol=" + symbol + "&interval=" + interval

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
            spinner: false
        })

        return;
    }

    buyHandler = async () => {
        let symbol = this.state.ticker;
        let lots =  100;
        let date = this.state.equityTable[this.state.equityTable.length-1]['date'];
        let value = this.state.equityTable[this.state.equityTable.length-1]['price']
        let user = sessionStorage.getItem('userId');
        let investmentEndpoint = 'http://localhost:8000/myinvestments/add'

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
        // data recieved! Next: send to state and display data (maybe in modal?)
        console.log("the buy data: ", data)
    }

    handleLogout = () => {
        this.props.history.push('/logout');
    };

    render(props) {

        const symbolResults = this.state.companyResults.map(element => {
            return <div key={element["1. symbol"]}>
                    <h3>{element["1. symbol"]}</h3>
                    <p>{element["2. name"]}</p>
                    <button type='submit' onClick={event => this.priceHandler(event, element["1. symbol"])}>Get chart data for this company</button>
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
                <Form onSubmit={this.tickerSearchHandler}>
                    <label>Search for a Ticker Symbol</label>
                    <Field name="tickerSymbol" type="text" />
                    <ErrorMessage name="tickerSymbol" />
                    <button type="submit">Search</button>
                </Form>
            </Formik>;

        const formCustom = 
            <Formik
                initialValues={{equitySymbol: "", lowEMAInterval: 0, highEMAInterval: 0, interval: "daily"}}
                validationSchema={Yup.object(
                    {
                        equitySymbol: Yup.string().required('Required'), 
                        lowEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"),
                        highEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"),
                    })}
                onSubmit={() => {
                    this.priceHandler()
                }}
            >
                <Form onSubmit={this.priceHandler}>
                    <label htmlFor="equitySymbol">Already know the symbol? </label>
                    <Field name="equitySymbol" type="text" />
                    <ErrorMessage name="equitySymbol" />

                    <label htmlFor="lowEMAInterval">Enter the shorter EMA interval: </label>
                    <Field name="lowEMAInterval" type="number" />
                    <ErrorMessage name="lowEMAInterval" />

                    <label htmlFor="highEMAInterval">Enter the longer EMA interval: </label>
                    <Field name="highEMAInterval" type="number" />
                    <ErrorMessage name="highEMAInterval" />

                    <label htmlFor="interval">Interval Period</label>
                    <Field name="interval" as="select">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </Field>
    
                    <button type="submit">Search</button>
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
        chart.draw();

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
            chartDisplay = <div><AnyChart
                width={800}
                height={600}
                instance={chart}
                title={`100-Day ${this.state.ticker} chart with EMA's of ${this.state.emaLow} & ${this.state.emaHigh}`}
            /></div>;
        }

        return (
            <div>
                <div>
                    <button onClick={this.handleLogout}>Logout</button>
                </div>
                {formSymbol}
                <button type="submit" onClick={this.clearSearchHandler}>Reset</button>
                {this.state.companyResults ? symbolResults : null}
                <br></br>
                {formCustom}
                <br></br> 
                {chartDisplay}
                <button type="submit" onClick={event => this.props.history.push('/investments')}>Your portfolio</button>
                <button type="submit" onClick={this.buyHandler}>Buy this stock!</button>
            </div>
            
            
        )
    }
}

export default ChartMain;