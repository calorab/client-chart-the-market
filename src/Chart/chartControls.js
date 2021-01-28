import React, {Component} from 'react'
import Aux from '../../hoc/Aux/Aux'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup';

class ChartControls extends Component {

    state = {
        ticker: "",
        submitting: false,

    }

    onSubmitHandler = () => {
        alert("Submitted!");
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
            <Aux>
                {form}
            </Aux>
        )
    }
}

export default ChartControls;