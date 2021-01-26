import React, {Component} from 'react'
import Aux from '../../hoc/Aux/Aux'
import {Formik, Field, Form, useField, useFormikContext} from 'formik'
import * as Yup from 'yup';
import { blanchedalmond } from 'color-name';

class ChartControls extends Component {
      
    render() {

        const formTicker = 
            <Formik
                initialValues={{}}
                validationSchema={Yup.object()}
                onSubmit={(bla, blah) => {}}
            >
                <Form>

                </Form>
            </Formik>;

        const formMain = 
            <Formik
                initialValues = {{}}
                validationSchema = {Yup.object()}
            >
                <Form>

                </Form>
            </Formik>;

        return (
            <Aux>
                {formTicker}
                {formMain}
            </Aux>
        )
    }
}

export default ChartControls;