// @flow

import React, { Component } from 'react';
import './Menu.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = {};
type State = {};

class Menu extends Component<Props, State> {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="Menu">
        <h1>Menu</h1>
      </div>
    );
  }
}

export default Menu;
