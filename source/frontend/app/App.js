// @flow

import React, { Component } from 'react';
import './sass/main.sass';
import './font/font.scss';
import * as Actions from './actions/Actions.js';
import Store from './stores/Store.js';

import AppBar from './containers/AppBar/AppBar.js';
import FluxExample from './containers/FluxExample/FluxExample.js';

type AppProps = {};

type AppState = {
  appTitle: string
};

class App extends Component<AppProps, AppState> {
  state = { appTitle: 'Timetable' };

  render() {
    return (
      <div className="App">
        <AppBar title={this.state.appTitle} />
        <FluxExample />
      </div>
    );
  }
}

export default App;
