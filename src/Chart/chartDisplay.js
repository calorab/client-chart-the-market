import React, {Component} from 'react'
import ChartData from './chartData'

class ChartDisplay extends Component {

    render() {
        return(
            <div>
                {/* ChartWindow component needed for the graph? */}
                <ChartData />
            </div>
        )
    }
}

export default ChartDisplay;