import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import './Nav.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import CalendarSVG from '../../img/CalendarSVG/CalendarSVG';
import MenuSVG from '../../img/MenuSVG/MenuSVG';
import ProfileSVG from '../../img/ProfileSVG/ProfileSVG';
import VsZHAWSVG from '../../img/VsZHAWSVG/VsZHAWSVG';
import ZHAWOSVG from '../../img/ZHAWOSVG/ZHAWOSVG';

class Nav extends Component {
  state = {};

  render() {
    return (
      <div className="Nav">
        <Link to="/vszhaw">
          <VsZHAWSVG />
          <div>VsZHAW</div>
        </Link>
        <Link to="/zhawo">
          <ZHAWOSVG />
          <div>ZHAWO</div>
        </Link>
        <Link to="/">
          <CalendarSVG />
          <div>Stundenplan</div>
        </Link>
        <Link to="/menu">
          <MenuSVG />
          <div>Menu</div>
        </Link>
        <Link to="/profile">
          <ProfileSVG />
          <div>Profile</div>
        </Link>
      </div>
    );
  }
}

export default Nav;
