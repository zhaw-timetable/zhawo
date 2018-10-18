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
import ZHAWO from './containers/ZHAWO/ZHAWO.js';
import VsZHAW from './containers/VsZHAW/VsZHAW.js';
import Menu from './containers/Menu/Menu.js';
import Profile from './containers/Profile/Profile.js';

type AppProps = { location: any };

type AppState = {
  appTitle: string
};

class App extends Component<AppProps, AppState> {
  state = {
    appTitle: 'Timetable'
  };

  componentWillMount() {
    console.log(process.env.NODE_ENV);
    console.log(window.location.pathname != '/');
    // do actual work part 2
  }

  render() {
    return (
      <Router>
        <div className="App">
          <AppBar />
          <Nav />
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/timetable" component={Timetable} />
            <Route exact path="/zhawo" component={ZHAWO} />
            <Route exact path="/vszhaw" component={VsZHAW} />
            <Route exact path="/menu" component={Menu} />
            <Route exact path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
