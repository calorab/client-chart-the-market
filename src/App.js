import React from 'react'
import {Route , Switch} from 'react-router-dom'

import ChartMain from './Chart/chartMain'

import './App.css';

function App() {
  
  // code below

  return (
    <div className="App">
      <header className="App-header">
      </header>
        <Switch>
          <Route path='/' component={ChartMain} />
        </Switch>
    </div>
  );
}

export default App;
