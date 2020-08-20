import React, {Component} from 'react'
import ChartData from './chartData'
import Aux from '../../hoc/Aux/Aux'

class ChartDisplay extends Component {

    render() {
        return(
            <Aux>
                {/* ChartWindow component needed for the graph? */}
                <ChartData />
            </Aux>
        )
    }
}

export default ChartDisplay;