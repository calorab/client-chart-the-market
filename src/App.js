import React from 'react'
import {Route} from 'react-router-dom'
import Aux from '../../hoc/Aux/Aux'
import ChartMain from './Chart/chartMain'
import Welcome from './welcome'

import './App.css';

function App() {
  
  // code below

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Aux>
        <Route exact path='/' component={Welcome} />
        <Route path='/chartmain' component={ChartMain} />
      </Aux>
    </div>
  );
}

export default App;
