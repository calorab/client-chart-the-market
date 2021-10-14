import React, {Component} from 'react';
import InvestmentCard from './investmentCard'
import investmentMath from '../utility/investmentMath';
import Button from '../UI/button'
import './investments.css'
require('dotenv').config();

class Investments extends Component {
    state = {
        investmentsArray: [],
        percentReturn: 'NOT FINISHED!',
        latestPrice: 9,
        saleData: {},
        roi: 0,
        profit: 0
    }

    componentDidMount() {
        if (!sessionStorage.getItem('userId') && this.props.history) {
            this.props.history.push('/auth');
        }
        this.getInvestmentsHandler();
    }

    getInvestmentsHandler = async () => {
        const investmentEndpoint = process.env.API_ENDPOINT + '/myinvestments';

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

    sellHandler = async (id, purchasePrice, symbol,  event) => {
        event.preventDefault();
        const saleEndpoint = process.env.API_ENDPOINT + 'myinvestments/sell';
        let response = await fetch(saleEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId'), investmentId: id})
        })

        const data = await response.json();
        //Phase 2: display sell data and send to state
       
        // get latest price
        const latestPriceEndpoint = process.env.API_ENDPOINT + 'myinvestments/saleprice'
        let latestPrice = await fetch(latestPriceEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({symbol: symbol})
        })

        let lastClose = await latestPrice.json();
        // console.log('Last Close Data: ', lastClose)  looks like: {date: '2021-10-05', price: 141.11}
        // save to state
        this.setState({
            saleData: lastClose
        })
        // do math
        let {roi, profit} = investmentMath(purchasePrice, this.state.saleData['price'])
        this.setState({
            roi: roi,
            profit: profit
        })
        // Phase 2:
        // display math 
        // call getInvestmenthander again to remove investment
        this.getInvestmentsHandler();
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
        // put inside IF statement so the above displays if array is empty
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
            <div className='investMain'>
                
                <div className='investResults'>
                    <div className='title'>
                        <h5>Your Portfolio</h5>
                    </div>
                    {myInvestmentResults}
                </div>
                <div className='line'></div>
                <div className='investNav'>   
                    <Button clicked={this.handleLogout}>Logout</Button>
                    <Button type='submit' clicked={event => this.props.history.push('/')}>Return to chart</Button>
                </div>
            </div>
            
        )
    }
}

export default Investments;