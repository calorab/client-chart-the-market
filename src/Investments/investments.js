import React, {Component} from 'react';

class Investments extends Component {
    state = {
        test: "",
        investmentsArray: []
    }

    componentDidMount() {
        if (!sessionStorage.getItem('userId') && this.props.history) {
            console.log('Hitting the investment IF statement');
            this.props.history.push('/auth');
        }
        this.getInvestmentsHandler();
    }

    getInvestmentsHandler = async () => {
        const investmentEndpoint = 'http://localhost:8000/myinvestments'

        let response = await fetch(investmentEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId')})
        })

        const data = await response.json();

        console.log("the data: ", data)
    }

    handleLogout = () => {
        this.props.history.push('/logout');
    };

    render(props) {

        return (
            <div>
                <h2>Your Data</h2>
                <div>IBM - 100 shares at 145</div>
                <div>AAPL - 200 shares at 350</div>
                <div>GOOG - 400 shares at 200</div>
                <button type='submit' onClick={event => this.props.history.push('/')}>Return to chart</button>
                <div>
                    <button onClick={this.handleLogout}>Logout</button>
                </div>
                <div>
                    <button onClick={this.getInvestmentsHandler}>Get Investments TEST BUTTON</button>
                </div>
            </div>
            
        )
    }
}

export default Investments;