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
        this.getSalesHandler();
    }

    getInvestmentsHandler = async () => {
        const investmentEndpoint = 'http://localhost:8000/myinvestments';
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
        const saleEndpoint = 'http://localhost:8000/myinvestments/sell';
        let response = await fetch(saleEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId'), investmentId: id})
        })

        const data = await response.json();
        data ? console.log("Data") : console.log("no Data");
        //Phase 2: display sell data and send to state
       
        // get latest price https://pure-ridge-03326.herokuapp.com/
        const latestPriceEndpoint = 'http://localhost:8000/myinvestments/saleprice'
        let latestPrice = await fetch(latestPriceEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({symbol: symbol})
        })

        let lastClose = await latestPrice.json();
        console.log('Last Close Data: ', lastClose);  // Data looks like: {date: '2021-10-05', price: 141.11}
        // save to state
        this.setState({
            saleData: lastClose
        })

        // INSTRUCTIONS FOR NEXT STEPS - 10/26
        // 1) POST to sale to log sale and update the DOM
        const allSaleEndpoint = 'http://localhost:8000/sale/'

        let postSale = await fetch(allSaleEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: symbol,
                lots: 100,
                date: this.state.saleData['date'],
                buyPrice: purchasePrice,
                sellPrice: this.state.saleData['price'],
                userId: sessionStorage.getItem('userId')
            })
        })

        const result = await postSale.json();
        console.log('The result of sale POST!!!!!: ', result)
        // 2) Set state and do math - CALEB2

        // do math
        let {roi, profit} = investmentMath(purchasePrice, this.state.saleData['price'])
        this.setState({
            roi: roi,
            profit: profit
        })
        // 3) Modal to display confirmations and maybe sell data from recent sale only - CALEB3

        // call getInvestmenthander again to remove investment
        await this.getInvestmentsHandler();
        // call getSalesHandler to update the portfolio results
        await this.getSalesHandler();
    }
// CALEBNOW - test API call!!
    getSalesHandler = async () => {
        const getSaleEndpoint = 'http://localhost:8000/sale/all';
        let response = await fetch(getSaleEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: sessionStorage.getItem('userId')})
        })

        const data = await response.json();
        // update state and/or format data and do math - CALEB0
        console.log("sales Handler post-response.json: ", data)
        
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