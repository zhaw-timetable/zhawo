// @flow

import React, { Component } from 'react';
import './AppBar.sass';
import * as Actions from '../../actions/GlobalActions.js';
import globalStore from '../../stores/GlobalStore.js';

type Props = { title: string };
type State = { title: string };

class AppBar extends Component<Props, State> {
  state = {
    title: this.props.title
  };

  render() {
    return (
      <div className="AppBar">
        Menu
        <title>{this.state.title}</title>
        Search
      </div>
    );
  }
}

export default AppBar;
