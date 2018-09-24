// @flow

import React, { Component } from 'react';
import './sass/main.sass';
import * as Actions from './actions/Actions.js';
import Store from './stores/Store.js';
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
        <h1>{this.state.appTitle}</h1>
        <FluxExample />
      </div>
    );
  }
}

export default App;
