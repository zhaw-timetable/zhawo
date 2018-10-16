// @flow

import React, { Component } from 'react';
import './Nav.sass';
import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore';

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
