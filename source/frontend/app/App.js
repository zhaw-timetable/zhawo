// @flow

import React, { Component } from 'react';
import './sass/main.sass';
import './font/font.scss';
import * as globalActions from './actions/GlobalActions';
import globalStore from './stores/GlobalStore.js';

import AppBar from './containers/AppBar/AppBar.js';
import Timetable from './containers/Timetable/Timetable.js';
import Nav from './containers/Nav/Nav.js';

type AppProps = {};

type AppState = {
  appTitle: string
};

class App extends Component<AppProps, AppState> {
  state = { appTitle: 'Timetable' };

  componentWillMount() {}

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

export default App;
