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

    onChartSubmithandler = async event => {

    }

    
    render() {

        const symbolResults = this.state.companyResults.map(element => {
            return <div>
                        <h3>{element.name}</h3>
                        <button type='submit' onClick={this.onChartSubmithandler()}>Get chart data for this company</button>                       
                    </div>
        })

        const form = 
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

        return (
            <div>
                {form}
                {symbolResults}
            </div>

            // <p>Hello World!</p>
        )
    }
}

export default ChartControls;