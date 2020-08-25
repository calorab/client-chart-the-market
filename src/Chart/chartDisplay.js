import React, {Component} from 'react'
import basicChart from '../../Assets/chart_basic.png'
import Aux from '../../hoc/Aux/Aux'

class ChartDisplay extends Component {

    render() {
        return(
            <Aux>
                {/* ChartWindow component needed for the graph? */}
                <img src={basicChart} alt='stock chart' />
            </Aux>
        )
    }
}

export default ChartDisplay;