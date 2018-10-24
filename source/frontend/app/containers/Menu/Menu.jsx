import React, { Component } from 'react';

import './Menu.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

class Menu extends Component {
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
