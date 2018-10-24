import React, { Component } from 'react';

import './AppBar.sass';

import globalStore from '../../stores/GlobalStore.js';
import * as Actions from '../../actions/GlobalActions.js';

import * as timetableActions from '../../actions/TimetableActions';

import Search from '../Search/Search.js';
import CalendarSVG from '../CalendarSVG/CalendarSVG.js';

class AppBar extends Component {
  state = {};

  render() {
    const currentDate = new Date();
    return (
      <div className="AppBar">
        Menu
        <title>ZHAWO</title>
        <div className="AppBarRight">
          <CalendarSVG onClick={() => timetableActions.gotoDay(currentDate)} />
          <Search />
        </div>
      </div>
    );
  }
}

export default AppBar;
