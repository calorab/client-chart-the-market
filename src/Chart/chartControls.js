import React, {Component} from 'react'
import Aux from '../../hoc/Aux/Aux'
import {Formik, Field, Form, useField, useFormikContext} from 'formik'

class ChartControls extends Component {
      
    render() {
        return (
            <Aux>

                {/* 
                CHART HERE!!

                NOTE:
                    Using AnyChart charting API and Alpha Vantage API
                */}
                
                <Formik initialValues={{symbol: "", check: []}} onSubmit={alert("Sumbitted")} >
                    <Form>
                        <div className='stockSymbol' name='symbol'>
                            <Field />
                        </div>
                        <div classname='checkboxes' role='group'>
                            <label>Analysis Tools</label>
                            <label>
                                <Field type='checkbox' name='check' value='macd' />
                            </label>
                            <label>
                                <Field type='checkbox' name='check' value='stoich' />
                            </label>
                            <label>
                                <Field type='checkbox' name='check' value='etc1' />
                            </label>
                            <label>
                                <Field type='checkbox' name='check' value='etc2' />
                            </label>   
                        </div>
                    </Form>
                    <button className='chartSubmitButton'>Submit</button>
                </Formik>
            </Aux>
        )
    }
}

export default ChartControls;