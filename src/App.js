import React from 'react'
import {Route , Switch} from 'react-router-dom'

import ChartMain from './Chart/chartMain'
import Investments from './Investments/investments'
import Auth from './Auth/auth'
import Logout from './Auth/logout'

import styles from './App.module.css';

function App() {

  return (
    <div className={styles.App}>
      {/* <header className={styles.App-header}>
      </header> */}
        <Switch>
          <Route path='/' exact component={ChartMain} />
          <Route path='/investments' component={Investments} />
          <Route path='/auth' component={Auth} />
          <Route path='/logout' component={Logout}/>
        </Switch>
    </div>
  );
}

export default App;
