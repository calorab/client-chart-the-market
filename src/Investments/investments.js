import React, {Component} from 'react';
import InvestmentCard from './investmentCard'
import investmentMath from '../utility/investmentMath';
import dataMapping from '../utility/dataMapping';

class Investments extends Component {
    state = {
        test: "STILL NOT FINISHED",
        investmentsArray: [],
        percentReturn: 'NOT FINISHED!',
        latestPrice: 9
    }

    componentDidMount() {
        if (!sessionStorage.getItem('userId') && this.props.history) {
            console.log('Hitting the investments IF statement');
            this.props.history.push('/auth');
        }
        this.getInvestmentsHandler();
    }

    // getCloseHandler = async (symbol) => {
    //     let priceEndpoint = "http://localhost:8000/chartdata?symbol=" + symbol;

    //     let response = await fetch(priceEndpoint, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     })

    //     let fullData = await response.json();
    //     // console.log('fullData: ', fullData)
    //     let priceData = fullData["Time Series (Daily)"];
    //     let priceArray = dataMapping(priceData);

    //     let recentValue = priceArray[priceArray.length-1]['price'];
        
    //     return recentValue;
    //     console.log('LatestPrice: ', this.state.latestPrice)
    // }

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
        console.log('DATA: ', data)
        this.setState({investmentsArray: data})
    }

    sellHandler = async (id, purchasePrice, symbol,  event) => {
        event.preventDefault();
        console.log("Button clicked)")
        const saleEndpoint = 'http://localhost:8000/myinvestments/sell'
        let response = await fetch(saleEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId'), investmentId: id})
        })

        const data = await response.json();
        console.log("the data: ", data)
       
        // get latest price
        const latestPriceEndpoint = 'http://localhost:8000/myinvestments/saleprice'
        let latestPrice = await fetch(latestPriceEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({symbol: symbol})
        })

        let lastClose = await latestPrice.json();
        console.log('Last Close Data: ', lastClose)
        // save to state
        // do math
        // display math
        // call getInvestmenthander again to remove investment
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

        // TO DO: UPDATE date format to look normal 
        // put inside IF statement so ther above displays if array is empty
        myInvestmentResults = myInvestmentsArray.map(element => {
            return <InvestmentCard 
                key={element.id}
                purchaseDate={element.purchaseDate}
                purchasePrice={element.purchasePrice}
                // latestClose={this.state.test}
                // return={investmentMath(element.purchasePrice, 200)}
                clicked={event => this.sellHandler(element.id, element.purchasePrice, element.symbol, event)}> 
                {element.symbol}
            </InvestmentCard>
        });

        return (
            <div>
                <h2>Your Investments</h2>
                <div>
                {myInvestmentResults}
                </div>
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