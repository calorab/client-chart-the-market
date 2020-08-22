import React, {Component} from 'react'

import ChartDisplay from './chartDisplay'
import ChartControls from './chartControls'
import ChartData from './chartData'
import Aux from '../../hoc/Aux/Aux'

class ChartMain extends Component {
    

    render() {
        return (
            <Aux>
                <ChartDisplay />
                <ChartData />
                <ChartControls />
            </Aux>
        )
    }
}

export default ChartMain;
