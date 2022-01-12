import React from 'react';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
import styles from './trackRecord.module.css'

const trackRecord = props => { 

    // create chart
    let chart = anychart.line([1,2,3,4,5,6]);
    chart.container('portfolioChart');
    chart.draw()
/* 

*/
    return (
        <>
            <h3>Track Record</h3>
            <p>To-date return (%): {props.percent.toFixed(2)}%</p>
            <p>To-Date profit ($): ${props.dollars.toFixed(2)}</p>
            <AnyChart  
                instance={chart} 
                id="portfolioChart"
                width={400}
                height={300}
                title={'Performance to Date'}
            />
        </>
    )
};

export default trackRecord;