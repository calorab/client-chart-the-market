import React, {Component} from 'react'
import ChartDisplay from './chartDisplay'
import ChartControls from './chartControls'
import Aux from '../../hoc/Aux/Aux'

class ChartMain extends Component {
    

    render() {
        return (
            <Aux>
                <ChartDisplay />
                <ChartControls />
            </Aux>
        )
    }
}

export default ChartMain;
