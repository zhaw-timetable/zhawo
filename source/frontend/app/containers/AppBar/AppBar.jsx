import React, { Component } from 'react';

import './AppBar.sass';

import * as scheduleActions from '../../actions/ScheduleActions';

import Search from '../Search/Search';
import CalendarSVG from '../../assets/img/CalendarSVG/CalendarSVG';

class AppBar extends Component {
  handleGoToTodayClick = e => {
    e.preventDefault();
    const currentDate = new Date();
    scheduleActions.gotoDay(currentDate);
  };

  render() {
    return (
      <div className="AppBar">
        Menu
        <title>zhawo</title>
        <div className="AppBarRight">
          <CalendarSVG onClick={this.handleGoToTodayClick} />
          <Search />
        </div>
      </div>
    );
  }
}

export default AppBar;
