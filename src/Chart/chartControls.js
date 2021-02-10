import React, {Component} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup';

class ChartControls extends Component {

    state = {
        ticker: "",
        submitting: false,
        companyResults: [],
        emaLow: [],
        emaHigh: [],
        macd: [],
        equityPrices: []
    }   
    
    fullChartDatahandler = async event => {
        const [emaLow, emaHigh, macd, priceData] = await Promise.all([this.emaLowHandler(), this.emaHighHandler(), this.macdHandler(), this.priceHandler()])
        console.log(this.state)
    }

    tickerSearchHandler = async event => {
        this.setState({submitting: true})
        // let keyword = event.target.tickerSymbol.value
        let apiEndpoint = "http://localhost:8000/symbol/stocksymbol?keyword=ibm" 

        let response = await fetch(apiEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const matches = await response.json();
        console.log(matches.bestMatches) 
        // this.setState({companyResults: matches.bestMatches, submitting: false})
        // console.log(this.state.companyResults)
    }

    emaLowHandler = async event => {
        let symbol = "ibm"
        let interval = "daily"
        let timePeriod = 10

        let emaLowEndpoint = "http://localhost:8000/chartdata/ema?symbol=" + symbol + "&interval=" + interval + "&time_period=" + timePeriod 

        let response = await fetch(emaLowEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let emaLow = await response.json()
        // console.log("emaLow: ", emaLow["Technical Analysis: EMA"]) 
        this.setState({emaLow: emaLow["Technical Analysis: EMA"]})
        return emaLow
    }

    emaHighHandler = async () => {
        let symbol = "ibm"
        let interval = "daily"
        let timePeriod = 10

        let emaHighEndpoint = "http://localhost:8000/chartdata/ema?symbol=" + symbol + "&interval=" + interval + "&time_period=" + timePeriod 

        let response = await fetch(emaHighEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let emaHigh = await response.json()
        // console.log("emaHigh: ", emaHigh["Technical Analysis: EMA"]) 
        this.setState({emaHigh: emaHigh["Technical Analysis: EMA"]})
        // console.log("EMA: ", this.state.emaHigh)
        return emaHigh
    }

    macdHandler = async () => {
        //IDEA: make emaLow = fast period and emaHigh = slow period and signalperiod 0(??)

        let symbol = "ibm"
        let interval = "daily"

        let macdEndpoint = "http://localhost:8000/chartdata/macd?symbol=" + symbol + "&interval=" + interval

        let response = await fetch(macdEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let macd = await response.json()
        // console.log("MACD: ", macd["Technical Analysis: MACD"])
        this.setState({macd: macd["Technical Analysis: MACD"]})
        // console.log("macd Data: ", this.state.macd)
        return macd
    }

    priceHandler = async () => {
        // IDEA: add weekly stock prices

        let symbol = "ibm"

        let priceEndpoint = "http://localhost:8000/chartdata?symbol=" + symbol

        let response = await fetch(priceEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let priceData = await response.json()
        // console.log("Price Data: ", priceData["Meta Data"]["2. Symbol"]) 
        this.setState({equityPrices: priceData["Time Series (Daily)"], ticker: priceData["Meta Data"]["2. Symbol"]})
        // console.log("Ticker: ", this.state.ticker, "price: ", this.state.equityPrices)
        return priceData
    }

    render() {

        const symbolResults = this.state.companyResults.map(element => {
            return <div>
                    <h3>{element.name}</h3>
                    <button type='submit' onClick={this.fullChartDatahandler()}>Get chart data for this company</button>                       
                </div>
        })

        const formSymbol = 
            <Formik
                initialValues={{tickerSymbol: ""}}
                validationSchema={Yup.object({tickerSymbol: Yup.string().required('Required')})}
                onSubmit={() => {
                    this.fullChartDatahandler()
                }}
            >
                <Form>
                    <label htmlFor="tickerSymbol">Search for a Ticker Symbol</label>
                    <Field name="tickerSymbol" type="text" />
                    <ErrorMessage name="tickerSymbol" />
                    <button type="submit">Search</button>
                </Form>
            </Formik>;

        const formCustom = 
            <Formik
                initialValues={{equitySymbol: "", lowEMAInterval: "", highEMAInterval: "", MACD: true}}
                validationSchema={Yup.object(
                    {
                        equitySymbol: Yup.string().required('Required'), 
                        lowEMAInterval: Yup.number().max(500, "No values over 500").min(5, "No values less than 5"), 
                        highEMAInterval: Yup.number().max(500, "no values over 500").min(5, "No values less than 5")
                    })}
                onSubmit={() => {
                    this.onChartSubmithandler()
                }}
            >
                <Form>
                    <label htmlFor="equitySymbol">Already know the symbol? </label>
                    <Field name="equitySymbol" type="text" />
                    <ErrorMessage name="equitySymbol" />

                    <label htmlFor="lowEMAInterval">Enter the shorter EMA interval: </label>
                    <Field name="lowEMAInterval" type="text" />
                    <ErrorMessage name="lowEMAInterval" />

                    <label htmlFor="highEMAInterval">Enter the longer EMA interval: </label>
                    <Field name="highEMAInterval" type="text" />
                    <ErrorMessage name="highEMAInterval" />

                    <label htmlFor="MACD">MACD:</label>
                    <Field name="MACD" type="checkbox" />
    
                    <button type="submit">Search</button>
                </Form>
            </Formik>;

        return (
            <div>
                {formSymbol}
                <br></br>
                {formCustom}
                {symbolResults}
            </div>

            // <p>Hello World!</p>
        )
    }
}

export default ChartControls;