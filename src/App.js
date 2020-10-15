import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './components/Home';


function App({user}) {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Home user={ user }/>
        </Route>
        <Route render={ () => (
          <div>
            <header>
              <h1 data-text='404'>404</h1>
            </header>
          </div>
        ) } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
