// @flow

import React, { Component } from 'react';
import './Nav.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = { title: string };
type State = { title: string };

class Nav extends Component<Props, State> {
  state = {
    title: this.props.title
  };

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
