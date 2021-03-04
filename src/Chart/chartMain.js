import React, {Component} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup';
import {AnyChart} from 'anychart-react'
import anychart from 'anychart'

class ChartMain extends Component {

    state = {
        ticker: "",
        submitting: false,
        companyResults: [],
        emaLow: 0,
        emaHigh: 0,
        equityPrices: [],
        showChart: false
    }   

    clearSearchHandler = () => {
        this.setState({ 
            ticker: "", 
            submitting: false, 
            companyResults: [],
            emaLow: 0,
            emaHigh: 0,
            equityPrices: [],
            showChart: false
        })
    }
    
    // fullChartDataHandler = async event => {
    //     event.preventDefault()
    //     console.log("State before search: ", this.state)
    //     let symbol = event.target.equitySymbol.value
    //     let interval = event.target.interval.value
    //     let EMALow = event.target.lowEMAInterval.value
    //     let EMAHigh = event.target.highEMAInterval.value
        
    //     this.setState({submitting: true, companyResults: []})
    //     const [emaLow, emaHigh, macd, priceData] = await Promise.all([
    //         this.emaLowHandler(symbol, interval, EMALow), 
    //         this.emaHighHandler(symbol, interval, EMAHigh), 
    //         this.macdHandler(symbol, interval), 
    //         this.priceHandler(symbol)
    //     ])
    //     console.log("SUCCESS!!! state: ", this.state)

    //     this.setState({submitting: false})
    // }

    // tickerSearchHandler = async event => {
    //     event.preventDefault()
    //     console.log("hi")
    //     this.setState({submitting: true})
    //     console.log("Event: ", event, "Event.target.tickerSymbol", event.target.tickerSymbol)
    //     let keyword = event.target.tickerSymbol.value;
    //     let apiEndpoint = "http://localhost:8000/symbol/stocksymbol?keyword=" + keyword

    //     let response = await fetch(apiEndpoint, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     const matches = await response.json();
    //     console.log("Response: ", matches.bestMatches) 
    //     this.setState({companyResults: matches.bestMatches, submitting: false})
    //     console.log('State: ', this.state.companyResults)
    // }

    // emaLowHandler = async (symbol, interval, EMALow) => {
        
    //     let emaLowEndpoint = "http://localhost:8000/chartdata/ema?symbol=" + symbol + "&interval=" + interval + "&time_period=" + EMALow 

    //     let response = await fetch(emaLowEndpoint, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })

    //     let emaLow = await response.json()
    //     // console.log("emaLow: ", emaLow["Technical Analysis: EMA"]) 
    //     this.setState({emaLow: emaLow["Technical Analysis: EMA"]})
    //     return emaLow
    // }

    // emaHighHandler = async (symbol, interval, EMAHigh) => {

    //     let emaHighEndpoint = "http://localhost:8000/chartdata/ema?symbol=" + symbol + "&interval=" + interval + "&time_period=" + EMAHigh 

    //     let response = await fetch(emaHighEndpoint, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })

    //     let emaHigh = await response.json()
    //     // console.log("emaHigh: ", emaHigh["Technical Analysis: EMA"]) 
    //     this.setState({emaHigh: emaHigh["Technical Analysis: EMA"]})
    //     // console.log("EMA: ", this.state.emaHigh)
    //     return emaHigh
    // }

    // macdHandler = async (symbol, interval) => {
    //     //IDEA: make emaLow = fast period and emaHigh = slow period and signalperiod 0(??)

    //     let macdEndpoint = "http://localhost:8000/chartdata/macd?symbol=" + symbol + "&interval=" + interval

    //     let response = await fetch(macdEndpoint, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })

    //     let macd = await response.json()
    //     // console.log("MACD: ", macd["Technical Analysis: MACD"])
    //     this.setState({macd: macd["Technical Analysis: MACD"]})
    //     // console.log("macd Data: ", this.state.macd)
    //     return macd
    // }

    priceHandler = async event => {
        // IDEA: add weekly stock prices
        let symbol = event.target.equitySymbol.value
        let EMALow = event.target.lowEMAInterval.value
        let EMAHigh = event.target.highEMAInterval.value

        let priceEndpoint = "http://localhost:8000/chartdata?symbol=" + symbol

        let response = await fetch(priceEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let priceData = await response.json()
        // console.log("Price Data: ", priceData["Meta Data"]["2. Symbol"]) 
        this.setState({equityPrices: priceData["Time Series (Daily)"], ticker: priceData["Meta Data"]["2. Symbol"], emaLow: EMALow, emaHigh: EMAHigh, showChart: true})
        console.log("Ticker: ", this.state.ticker, "PRICE: ", this.state.equityPrices)
        return 
    }

    render() {

        const symbolResults = this.state.companyResults.map(element => {
            return <div key={element["1. symbol"]}>
                    <h3>{element["1. symbol"]}</h3>
                    <p>{element["2. name"]}</p>
                    {/* <button type='submit' onClick={this.fullChartDatahandler}>Get chart data for this company</button>                        */}
                </div>
        })

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
                initialValues={{equitySymbol: "", lowEMAInterval: "", highEMAInterval: "", MACD: true, interval: "daily"}}
                validationSchema={Yup.object(
                    {
                        equitySymbol: Yup.string().required('Required'), 
                        lowEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"), 
                        highEMAInterval: Yup.number().max(500, "no values over 500").min(5, "No values less than 5")
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

                    <label htmlFor="MACD">MACD:</label>
                    <Field name="MACD" type="checkbox" />

                    <label>Interval Period</label>
                    <Field name="interval" as="select">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </Field>
    
                    <button type="submit">Search</button>
                </Form>
            </Formik>;


            let mainChartTable = anychart.data.table();
            mainChartTable.addData(this.state.equityPrices);

            let priceMapping = mainChartTable.mapAs({open: , High: , Low: , close: ,}) // HOW-TO for Objects - HEREEEEEEEEEEEE

            let chart = anychart.stock();

            let mainChart = chart.plot(0);
            mainChart.candlestick(priceMapping).name(this.state.ticker);

            // let macdPlot = chart.plot(1);
            // macdPlot.splineArea(orclDataTable.mapAs({'value': 4})).fill('#1976d2 0.65').stroke('1.5 #1976d2').name('ORCL');

                    // ------- Scroller is for sliding date range - see chart here: https://www.anychart.com/technical-integrations/samples/react-charts/#examples

            // chart.scroller().area(msftDataTable.mapAs({'value': 4}));
            // chart.selectRange('2005-01-03', '2005-11-20');
        
            // {/* ChartWindow component needed for the graph? 
            //     anyChart links for later:
            //         https://github.com/AnyChart/AnyChart-React/ - React Plugin
            //         https://api.anychart.com/anychart.charts.Stock#category-specific-settings - Stock funcs for AnyChart
            //         https://www.alphavantage.co/documentation/ - AlphaVantage api Documentation

            // */}
            // 

        return (
            <div>
                {formSymbol}
                <button type="submit" onClick={this.clearSearchHandler}>Reset</button>
                {this.state.companyResults ? symbolResults : null}
                <br></br>
                {formCustom}
                <br></br>
                {this.state.showChart ? <div><AnyChart
                width={800}
                height={600}
                instance={chart}
                title={this.state.ticker}
                /></div> : null}
            </div>
            
            
        )
    }
}

export default ChartMain;