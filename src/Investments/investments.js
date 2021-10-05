import React, {Component} from 'react';
import InvestmentCard from './investmentCard'
import investmentMath from '../utility/investmentMath';

class Investments extends Component {
    state = {
        test: "",
        investmentsArray: [],
        percentReturn: 'NOT FINISHED!',
        latestClosePrice: 200
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

        this.setState({investmentsArray: data})
    }

    sellHandler = async (id, event) => {
        event.preventDefault();
        console.log("Button clicked)")
        // const investmentEndpoint = 'http://localhost:8000/myinvestments/sell'
        // let response = await fetch(investmentEndpoint, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({userId: sessionStorage.getItem('userId')})
        // })

        // const data = await response.json();

        // console.log("the data: ", data)
    }

    handleLogout = () => {
        this.props.history.push('/logout');
    };

    render() {

        let myInvestmentsArray = [];
        for (const element of this.state.investmentsArray) {
            myInvestmentsArray.push({
                id: element._id,
                symbol: element.equity,
                purchaseDate: element.date,
                purchasePrice: element.buyPrice, 
            })
        }

        let myInvestmentResults = 
        <div>
            <h5>You have no Investments</h5>
            <p>Return to the main page to buy stocks and see them here!</p>
        </div>;

        // TO DO: UPDATE date format to look normal and CREATE math utility function for return%
        myInvestmentResults = myInvestmentsArray.map(element => {
            return <InvestmentCard 
                key={element.id}
                purchaseDate={element.purchaseDate}
                purchasePrice={element.purchasePrice}
                latestClose={this.state.latestClosePrice}
                return={investmentMath(element.purchasePrice, this.state.latestClosePrice)}
                clicked={event => this.sellHandler(element.id, event)}> 
                {element.symbol}
            </InvestmentCard>
        });

        return (
            <div>
                <h2>Your Investments</h2>
                {myInvestmentResults}
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