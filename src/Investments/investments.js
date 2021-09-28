import React, {Component} from 'react';

class Investments extends Component {
    state = {
        test: "Portfolio 1",
    }

    testHandler = () => {
        this.setState({test: "BOOM!!!!!!!!!"});
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