import React, {Component} from 'react';
import InvestmentCard from './investmentCard'
import investmentMath from '../utility/investmentMath';
import Button from '../UI/button';
import Modal from '../UI/modal';
import Wrapper from '../utility/Wrapper/wrapper';
import TrackRecord from './trackRecord';
import './investments.css'
require('dotenv').config();

class Investments extends Component {
    state = {
        investmentsArray: [],
        soldSymbol: '',
        latestPrice: 9,
        saleData: {},
        roi: 0,
        profit: 0,
        modal: false,
        toDateReturn: 0,
        toDateProfit: 0
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

        
        let {roi, profit} = investmentMath(purchasePrice, this.state.saleData['price'])
        this.setState({
            roi: roi,
            profit: profit,
            modal: true,
            soldSymbol: symbol
        })
        
        await this.getInvestmentsHandler();
        
        await this.getSalesHandler();
    }

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
       
        console.log("sales Handler post-response.json: ", data) ;

        this.statsHandler(data);
        console.log('statsHandler state values (return/profit): ', this.state.toDateReturn, this.state.toDateProfit);
    }

    statsHandler = (arr) => {
        let dollar = 0;
        let percentage = 0;
        
        for (let i=0; i<arr.length; i++) {
            let {roi, profit} = investmentMath(arr[i]['buyPrice'], arr[i]['sellPrice']);
            dollar += profit;
            percentage += roi;
        }
        this.setState({toDateReturn: percentage, toDateProfit: dollar})
    };

    handleLogout = () => {
        this.props.history.push('/logout');
    };

    handleModal = () => {
        this.setState({modal: false})
    }

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

        if (this.state.investmentsArray) {
            myInvestmentResults = myInvestmentsArray.map(element => {
                return <InvestmentCard 
                    key={element.id}
                    purchaseDate={element.purchaseDate}
                    purchasePrice={element.purchasePrice}
                    clicked={event => this.sellHandler(element.id, element.purchasePrice, element.symbol, event)}> 
                    {element.symbol}
                </InvestmentCard>
            });
        }

        const sellMessage = `You have sold ${this.state.soldSymbol} stock for $${this.state.saleData.price}, netting $${this.state.profit} per share or ${this.state.roi}%`;

        return (
            <Wrapper>
                {this.state.modal ? <Modal title={`${this.state.soldSymbol} Stock Sold!`} message={sellMessage} onConfirm={this.handleModal}></Modal> : null}
                <div className='investMain'>
                    <div className='investResults'>
                        <div className='title'>
                            <h5>Your Portfolio</h5>
                        </div>
                        {myInvestmentResults}
                    </div>
                    <div className='line'></div>
                    <div className='investNav'>  
                        <TrackRecord percent={this.state.toDateReturn} dollars={this.state.toDateProfit}/>
                        <Button clicked={this.handleLogout}>Logout</Button>
                        <Button type='submit' clicked={event => this.props.history.push('/')}>Return to chart</Button>
                    </div>
                </div>
            </Wrapper>
            
        )
    }
}

export default Investments;