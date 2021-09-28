import React from 'react'
import {Route , Switch} from 'react-router-dom'

import ChartMain from './Chart/chartMain'
import Investments from './Investments/investments'

import './App.css';

function App() {
  
  // code below

  return (
    <div className="App">
      <header className="App-header">
      </header>
        <Switch>
          <Route path='/' exact component={ChartMain} />
          <Route path='/investments' component={Investments} />
        </Switch>
    </div>
  );
}

export default App;
