import React, {Component} from 'react'
import ChartDisplay from './chartDisplay'
import ChartControls from './chartControls'

class ChartMain extends Component {
    
    
    render() {
        return (
            <div>
                <ChartDisplay />
                <ChartControls />
            </div>
        )
    }
}

export default ChartMain;
