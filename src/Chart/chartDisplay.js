import React, {Component} from 'react'
import basicChart from '../../Assets/chart_basic.png'
import Aux from '../../hoc/Aux/Aux'

class ChartDisplay extends Component {

    render() {
        return(
            <Aux>
                {/* ChartWindow component needed for the graph? 
                    anyChart links for later:
                        https://github.com/AnyChart/AnyChart-React/ - React Plugin
                        https://api.anychart.com/anychart.charts.Stock#category-specific-settings - Stock funcs for AnyChart
                        https://www.alphavantage.co/documentation/ - AlphaVantage api Documentation

                */}
                <img src={basicChart} alt='stock chart' />
            </Aux>
        )
    }
}

export default ChartDisplay;