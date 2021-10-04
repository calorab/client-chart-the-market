import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Logout extends Component {

    componentDidMount () {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
    }

    render() {
        return <Redirect to="/" />
    }
};

export default Logout;