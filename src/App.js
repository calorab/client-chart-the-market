import React from 'react';
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
      <main>
        <Welcome></Welcome>
        <ChartMain />
      </main>
    </div>
  );
}

export default App;
