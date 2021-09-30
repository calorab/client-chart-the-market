import React, {Component} from 'react';

class Investments extends Component {
    state = {
        test: "", 
    }

    componentDidMount() {
        this.getInvestmentsHandler();
    }

    getInvestmentsHandler = async () => {
        const investmentEndpoint = 'http://localhost:8000/myinvestments'

        let response = await fetch(investmentEndpoint, {
            headers: {
                'Content-Type': 'application/json'
            },
            
        })

        const data = await response.text();

        this.setState({test: data})
    }

    testHandler = async () => {
        // create hardcoded email and password for test
        let registerEndpoint = 'http://localhost:8000/user/register'
        // send fetch req w/ body
        let response = await fetch(registerEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({
                email: "test@test.com",
                password: "12345"
            }),
        })

        let data = await response.json();
        console.log("THE DATA... ", data);
    }

    render(props) {

        return (
            <div>
                <h2>{this.state.test}</h2>
                <div>IBM - 100 shares at 145</div>
                <div>AAPL - 200 shares at 350</div>
                <div>GOOG - 400 shares at 200</div>
                <button type='submit' onClick={event => this.testHandler()}>Testing...1, 2, 3</button>
                <button type='submit' onClick={event => this.props.history.push('/')}>Return to chart</button>
            </div>
        )
    }
}

export default Investments;