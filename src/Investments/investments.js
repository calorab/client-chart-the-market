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

        this.setState({investmentsArray: data})

        console.log("state.investmentsArray: ", this.state.investmentsArray)
    }

    sellHandler = async () => {
        const investmentEndpoint = 'http://localhost:8000/myinvestments/sell'
        let response = await fetch(investmentEndpoint, {
            method: 'DELETE',
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
            <h5>Such Empty!</h5>
            <p>Return to the main page to buy stocks and see them here!</p>
        </div>;

        // START HERE: Create component for investment display!
        myInvestmentResults = myInvestmentsArray.map(element => {
            return <MyArtistItem 
                key={element.data._id}
                link={element.data.url}
                tour={element.data.tour ? element.data.tour : 'Not on tour'}
                cnclButton={event => this.unfollowHandler(element.data._id, event)}>
                {element.data.name}
            </MyArtistItem>
        });
        return (
            <div>
                <h2>Your Data</h2>
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