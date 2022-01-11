import React, {useEffect} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './auth.module.css'
import Button from '../UI/button'

const Auth = props => {

    useEffect(() => {
        // Check if already logged in
        if (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== "undefined") {
            props.history.push('/investments');
        } 
    }) 

    
    const onAuthHandler = async (event) => {
        event.preventDefault();
        let apiEndpoint = "https://pure-ridge-03326.herokuapp.com/user/signin"
        // for a future update...
        // if (!this.state.login) {
        //     apiEndpoint = 'https://pure-ridge-03326.herokuapp.com/user/register';
        // }
        
        let response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: event.target.email.value, 
                password: event.target.password.value
            })
        }).catch(err => console.log(err))

        let data = await response.json().catch(err => console.log(err));
        
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.userId);
        props.history.push('/investments');
    };

    const signinForm = 
        <Formik
            initialValues={{ email: '', password: ''}}
            validationSchema={Yup.object({
            email: Yup.string()
                .email('Must be in the format of an email address')
                .required('Required'),
            password: Yup.string()
                .min(5, 'Too short - minimum 5 characters!')
                .required('Required')
            })}
            onSubmit={({ setSubmitting }) => { 
                onAuthHandler();
            }}>
            <Form className={styles.authForm} onSubmit={onAuthHandler} >
                <label htmlFor='email' >Email:</label>
                <Field name="email" type="email" className={styles.inputEmail} value='test@test.com' />
                <ErrorMessage name="email" />
                <label htmlFor='password' >Password:</label>
                <Field name="password" type="" className={styles.inputPassword} value='12345' />
                <ErrorMessage name="password" />
                <Button type='submit'>Log-in</Button>
            </Form>
        </Formik>;

    return (
        <div className={styles.formContainer}>
            <div>
            {signinForm}
            </div>
            <div className={styles.lineAuth}></div>
            <div className={styles.authIntro}>
                <h3>Sign into the Demo account</h3>
                <p>Sign in to the left to checkout your portfolio and buy </p>
                <p>and sell stocks.</p>
                <Button clicked={event => props.history.push('/')}>Back to Home</Button>
            </div>
        </div>
    )
}

export default Auth;