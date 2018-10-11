// @flow

import React, { Component } from 'react';
import './sass/main.sass';
import './font/font.scss';
import * as Actions from './actions/Actions.js';
import Store from './stores/Store.js';

import AppBar from './containers/AppBar/AppBar.js';
import Timetable from './containers/Timetable/Timetable.js';
import Nav from './containers/Nav/Nav.js';

import Login from './containers/Login/Login.js';

type AppProps = {};

type AppState = {
  appTitle: string
};

class App extends Component<AppProps, AppState> {
  state = { appTitle: 'Timetable' };

  componentWillMount() {
    console.log(process.env.NODE_ENV);

    // do actual work part 2
  }

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
}*/

  // Login
  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

export default App;
