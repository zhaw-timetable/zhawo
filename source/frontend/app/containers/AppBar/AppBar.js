// @flow

import React, { Component } from 'react';
import './AppBar.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = { title: string };
type State = { title: string };

class AppBar extends Component<Props, State> {
  state = {
    title: this.props.title
  };

  render() {
    return (
      <div className="AppBar">
        <title>{this.state.title}</title>
      </div>
    );
  }
}

export default AppBar;
