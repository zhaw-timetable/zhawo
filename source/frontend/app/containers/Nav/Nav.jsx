import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import './Nav.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

class Nav extends Component {
  state = {};

  render() {
    return (
      <div className="Nav">
        <Link to="/vszhaw">VsZHAW</Link>
        <Link to="/zhawo">ZHWO</Link>
        <Link to="/">Stundenplan</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/profile">Profile</Link>
      </div>
    );
  }
}

export default Nav;
