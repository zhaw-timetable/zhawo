// @flow

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './sass/main.sass';
import './font/font.scss';
import * as globalActions from './actions/GlobalActions';
import globalStore from './stores/GlobalStore.js';

import AppBar from './containers/AppBar/AppBar.js';
import Timetable from './containers/Timetable/Timetable.js';
import Nav from './containers/Nav/Nav.js';
import NotFound from './containers/NotFound/NotFound.js';
import Login from './containers/Login/Login.js';

type AppProps = {};

type AppState = {
  appTitle: string
};

class App extends Component<AppProps, AppState> {
  state = { appTitle: 'Timetable' };

  componentWillMount() {}

  /* Timetable
   render() {
    return (
      <div className="App">
        <AppBar title={this.state.appTitle} />
        <Timetable />
        <Nav />
      </div>
    );
  }
}

<Route component={NotFoundComponent}></Route>
*/

  // Login
  render() {
    return (
      <div className="App">
        <AppBar title={this.state.appTitle} />
        <Router>
          <Switch>
            <Route exact path="/app/" component={Timetable} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Nav />
      </div>
    );
  }
}

export default App;
