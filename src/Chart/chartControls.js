import React, {Component} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup';

class ChartControls extends Component {

    state = {
        ticker: "",
        submitting: false,
        companyResults: [],
    }

   
    
    onTickerSubmitHandler = async event => {
        this.setState({submitting: true})
        // let keyword = event.target.tickerSymbol.value
        let apiEndpoint = "http://localhost:8000/symbol/stocksymbol?keyword=ibm" 

        let response = await fetch(apiEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const matches = await response.json();
        // console.log(matches.bestMatches)
        this.setState({companyResults: matches.bestMatches, submitting: false})
        // console.log(this.state.companyResults)
    }

    // onChartSubmithandler = async event => {
    //     const [emaLow, emaHigh, macd, price] = await Promise.all([onEMALowHandler(), onEMAHighHandler(), onMACDHandler(), onPriceHandler()])
    // }

    onEMALowHandler = async event => {
        let symbol = "ibm"
        let interval = 10
        let timePeriod = "daily"

        let emaLowEndpoint = "http://localhost:8000/chartdata/ema?symbol=" + symbol + "&interval=" + interval + "&time_period=" + timePeriod 

        let response = await fetch(emaLowEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let emaLow = await response.json()

        return emaLow
    }

    onEMAHighHandler = () => {}

    onMACDHandler = () => {}

    onPriceHandler = () => {}

    render() {

        const symbolResults = this.state.companyResults.map(element => {
            return <div>
                        <h3>{element.name}</h3>
                        <button type='submit' onClick={this.onChartSubmithandler()}>Get chart data for this company</button>                       
                    </div>
        })

        const formSymbol = 
            <Formik
                initialValues={{tickerSymbol: ""}}
                validationSchema={Yup.object({tickerSymbol: Yup.string().required('Required')})}
                onSubmit={() => {
                    this.onTickerSubmitHandler()
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
                initialValues={{equitySymbol: "", lowEMAInterval: "", highEMAInterval: "", MACD: true, MACDInterval: ""}}
                validationSchema={Yup.object({tickerSymbol: Yup.string().required('Required')})}
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
                    
                    <label htmlFor="MACDInterval">MACD Interval: </label>
                    <Field name="MACDInterval" type="text" />
                    <ErrorMessage name="MACDInterval" />
                    
                    <button type="submit">Search</button>
                </Form>
            </Formik>;

        return (
            <div>
                {formSymbol}
                {formCustom}
                {symbolResults}
            </div>

            // <p>Hello World!</p>
        )
    }
}

export default ChartControls;