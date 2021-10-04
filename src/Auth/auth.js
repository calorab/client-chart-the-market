import React, {Component} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

class Auth extends Component {
    state = {
        login: true,
    }

    componentDidMount = () => {
        // Check if already logged in
        console.log('Pushing to /investments');
        if (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== "undefined") {
            this.props.history.push('/investments');
        } 
    };

    onAuthHandler = async (event) => {
        event.preventDefault();
        this.setState({login: false});
        let apiEndpoint = 'http://localhost:8000/user/signin';
        if (!this.state.login) {
            apiEndpoint = 'http://localhost:8000/user/register'
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

        // Data looks like {token: "...AJKS63BC396BHV3vjv4...", userId: "...139884359..."}
        let data = await response.json();
        // Error handling???
        console.log('The Data: ', data)
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.userId);
        console.log('Session Storage: ', sessionStorage);
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
                <Form className='testing' onSubmit={this.onAuthHandler} >
                    <Field name="email" type="email" className='inputEmail' value='test@test.com' />
                    <ErrorMessage name="email" />
                    <Field name="password" type="" className='inputPassword' value='12345' />
                    <ErrorMessage name="password" />
                    <br></br>
                    <button type='submit' >Log-in</button>
                    {/* <Button 
                        className='testing1' 
                        btnType='Success'
                        type='submit'>
                        {this.state.isSignup ? 'SIGNUP' : 'LOGIN'}
                    </Button> */}
                </Form>
            </Formik>;

        return (
            <div className='formContainer'>
                {signinForm}
            </div>
        )
    }
}

export default Auth;