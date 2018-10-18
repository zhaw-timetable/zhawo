// @flow

import React, { Component } from 'react';
import './AppBar.sass';
import * as Actions from '../../actions/GlobalActions.js';
import globalStore from '../../stores/GlobalStore.js';

type Props = {};
type State = {};

class AppBar extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div className="AppBar">
        Menu
        <title>ZHAWO</title>
        Search
      </div>
    );
  }
}

export default AppBar;
