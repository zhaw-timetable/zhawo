// @flow

import React, { Component } from 'react';
import './Nav.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = {};
type State = {};

class Nav extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div className="Nav">
        <span>VsZHAW</span> <span>ZHWO</span> <b>Stundenplan</b>{' '}
        <span>Menu</span> <span>Profile</span>
      </div>
    );
  }
}

export default Nav;
