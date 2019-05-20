import React, { Component, Fragment } from 'react';
import {
  format,
  isToday,
  isSameDay,
  addWeeks,
  subWeeks,
  getISOWeek
} from 'date-fns';
import * as deLocale from 'date-fns/locale/de/index.js';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';

import './NavigationWeek.sass';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

/**
 * Navigation Week Component
 * Week days Mon-Sat used for navigation.
 *
 * @class NavigationWeek
 * @extends {Component}
 */
class NavigationWeek extends Component {
  state = {
    displayDay: scheduleStore.displayDay,
    displayWeek: scheduleStore.displayWeek
  };

  componentWillMount() {
    scheduleStore.on('schedule_changed', this.refreshNavigation);
  }

  componentWillUnmount() {
    scheduleStore.removeListener('schedule_changed', this.refreshNavigation);
  }

  /**
   * Function called when store changes.
   * Sets local displayDay and displayWeek state to match store.
   *
   * @memberof NavigationWeek
   */
  refreshNavigation = () => {
    this.setState({
      displayDay: scheduleStore.displayDay,
      displayWeek: scheduleStore.displayWeek
    });
  };

  /**
   * Function set current date to given date using gotoDay action
   *
   * @param {date} newDate
   * @memberof NavigationWeek
   */
  handleDateClick = newDate => e => {
    scheduleActions.gotoDay(newDate);
  };

  /**
   * Function that  changes day by calling gotoDay action.
   * Before calling gotoDay it subtracts a week from the current date.
   *
   * @memberof NavigationWeek
   */
  handleWeekBackClick = e => {
    const newDate = subWeeks(this.state.displayDay, 1);
    scheduleActions.gotoDay(newDate);
  };

  /**
   * Function that  changes day by calling gotoDay action.
   * Before calling gotoDay it adds a week from the current date.
   *
   * @memberof NavigationWeek
   */
  handleWeekForwardClick = e => {
    const newDate = addWeeks(this.state.displayDay, 1);
    scheduleActions.gotoDay(newDate);
  };

  render() {
    return (
      <Fragment>
        <div className="arrow">
          <IconButton
            onClick={this.handleWeekBackClick}
            aria-label="WeekBack"
            color="inherit"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </div>
        {this.state.displayWeek.map(date => (
          <ButtonBase
            key={date}
            className={`DayButtonBase day ${
              isSameDay(date, this.state.displayDay) ? 'active' : ''
            } ${isToday(date) ? 'today' : ''}`}
            name={date}
            onClick={this.handleDateClick(date)}
            color="inherit"
          >
            <div className="name">
              {format(date, 'dd', { locale: deLocale })}
            </div>
            <div className="date">
              {format(date, 'D')}.{format(date, 'M', { locale: deLocale })}
            </div>
          </ButtonBase>
        ))}
        <div className="arrow">
          <IconButton
            onClick={this.handleWeekForwardClick}
            aria-label="WeekForward"
            color="inherit"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </Fragment>
    );
  }
}

export default NavigationWeek;
