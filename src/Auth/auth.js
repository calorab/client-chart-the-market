import React, {Component} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './auth.css'
import Button from '../UI/button'
require('dotenv').config();

class Auth extends Component {
    state = {
        login: true,
    }

    componentDidMount = () => {
        // Check if already logged in
        if (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== "undefined") {
            this.props.history.push('/investments');
        } 
    };

    
    onAuthHandler = async (event) => {
        event.preventDefault();
        this.setState({login: false});
        let apiEndpoint = "https://pure-ridge-03326.herokuapp.com/user/signin"
        if (!this.state.login) {
            apiEndpoint = 'https://pure-ridge-03326.herokuapp.com/user/register';
        }
        
        let response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: event.target.email.value, 
                password: event.target.password.value
            })
        });

        let data = await response.json().catch(err => console.log(err));
        console.log("DATA: ", data)
        
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.userId);
        this.props.history.push('/investments');
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {login: !prevState.login}
        });
    };
    
    render() {

        // let registerForm = 
        //     <Formik
        //         initialValues={{ email: '', password: '', password2: ''}}
        //         validationSchema={Yup.object({
        //         email: Yup.string()
        //             .email('Invalid email address')
        //             .required('Required'),
        //         password: Yup.string()
        //             .min(5, 'Too short - minimum 5 characters!')
        //             .required('Required'),
        //         password2: Yup.string().test('pswd-valid', 'Passwords must match', (value) => value === values.password)
        //         })}
        //         onSubmit={({ setSubmitting }) => { 
        //             // this.onAuthHandler();
        //         }}>
        //         <Form className='testing' onSubmit={this.onAuthHandler} >
        //             <Field name="email" type="email" className={classes.InputElement} placeholder='Your Email' />
        //             <ErrorMessage name="email" />
        //             <Field name="password" type="" className={classes.InputElement2} placeholder='Your Password' />
        //             <ErrorMessage name="password" />
        //             <Field name="password2" type="" className={inputPassword2} placeholder='Re-enter Password' />
        //             <ErrorMessage name="password2" />
        //             <br></br>
        //             <button type='submit' ></button>
        //             {/* <Button 
        //                 className='testing1' 
        //                 btnType='Success'
        //                 type='submit'>
        //                 {this.state.isSignup ? 'SIGNUP' : 'LOGIN'}
        //             </Button> */}
        //         </Form>
        //     </Formik>;

        let signinForm = 
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
                    this.onAuthHandler();
                }}>
                <Form className='authForm' onSubmit={this.onAuthHandler} >
                    <label htmlFor='email' >Email:</label>
                    <Field name="email" type="email" className='inputEmail' value='test@test.com' />
                    <ErrorMessage name="email" />
                    <label htmlFor='password' >Password:</label>
                    <Field name="password" type="" className='inputPassword' value='12345' />
                    <ErrorMessage name="password" />
                    <Button type='submit'>Log-in</Button>
                </Form>
            </Formik>;

        return (
            <div className='formContainer'>
                <div>
                {signinForm}
                </div>
                <div className='lineAuth' ></div>
                <div className='authIntro'>
                    <h3>Sign into the Demo account</h3>
                    <p>Sign in to the left to checkout your portfolio and buy </p>
                    <p>and sell stocks.</p>
                    <Button clicked={event => this.props.history.push('/')}>Back to Home</Button>
                </div>
            </div>
        )
    }
}

export default Auth;