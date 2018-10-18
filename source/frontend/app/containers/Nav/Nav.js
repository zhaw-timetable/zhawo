// @flow

import React, { Component } from 'react';

import { Link } from 'react-router-dom';

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
        <Link to="/vszhaw">VsZHAW</Link>
        <Link to="/zhawo">ZHWO</Link>
        <Link to="/timetable">Stundenplan</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/profile">Profile</Link>
      </div>
    );
  }
}

export default Nav;
