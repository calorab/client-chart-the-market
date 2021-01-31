import React, {Component} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup';

class ChartControls extends Component {

    state = {
        ticker: "",
        submitting: false,

    }

    onSubmitHandler = async () => {
        let result = await this.testForHandler()
        console.log(result);
        return result
    }

    testForHandler() {
        console.log('test');
        return 'finished'
    }

    render() {

        

        const form = 
            <Formik
                initialValues={{tickerSymbol: ""}}
                validationSchema={Yup.object({tickerSymbol: Yup.string().required('Required')})}
                onSubmit={() => {
                    this.onSubmitHandler()
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
            </div>

            // <p>Hello World!</p>
        )
    }
}

export default ChartControls;