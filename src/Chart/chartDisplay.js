import React from 'react';
import styles from './chartMain.module.css';
import AnyChart from 'anychart-react';
import anychart from 'anychart';

const ChartDisplay = props => {
// PROPS: dataTable,emaLow,emaHigh,ticker

    // create table
    let dataTable = anychart.data.table('date');
    // add data
    dataTable.addData(props.dataTable); 
    // mapAs
    let mapping = dataTable.mapAs({x: 'date', value: 'price'});
    // create chart
    let chart = anychart.stock();
    // add series
    let series = chart.plot(0).column(mapping);

    // --- technical indicators ---
    chart.plot(0).ema(mapping, props.emaLow, "line");
    chart.plot(0).ema(mapping, props.emaHigh, "line");
    chart.plot(1).macd(mapping);

    series.name(`${props.ticker}`);
    chart.container('chartContainer');

    // --- Styling ---
    chart.background().fill('rgb(128, 128, 128');
    chart.background().cornerType('round')
    chart.background().corners('10')
    // chart.draw();

        // {/* ChartWindow component needed for the graph? 
        //     anyChart links for later:
        //         https://github.com/AnyChart/AnyChart-React/ - React Plugin
        //         https://api.anychart.com/anychart.charts.Stock#category-specific-settings - Stock funcs for AnyChart
        //         https://www.alphavantage.co/documentation/ - AlphaVantage api Documentation

        // */}

    return (
        <div className={styles.chartContainer}>
            <AnyChart
                id={styles.chartContainer}
                width={800}
                height={600}
                instance={chart}
                title={`100-Day ${props.ticker} chart with EMA's of ${props.emaLow} & ${props.emaHigh}`}
            />
        </div>
        
    )
}

export default ChartDisplay;