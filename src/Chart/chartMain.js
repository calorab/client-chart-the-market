import React, {Component} from 'react'

import ChartDisplay from './chartDisplay'
import ChartControls from './chartControls'

class ChartMain extends Component {
    

    render() {
        return (
            <div>
                <ChartControls />
                <ChartDisplay />
            </div>
            
        )
    }
}

export default ChartMain;
