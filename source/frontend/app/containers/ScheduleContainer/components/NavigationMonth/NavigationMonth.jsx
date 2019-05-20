import React, { Component, Fragment } from 'react';
import {
  format,
  isToday,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  getISOWeek
} from 'date-fns';
import * as deLocale from 'date-fns/locale/de/index.js';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';

import './NavigationMonth.sass';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

/**
 * Function called when store changes.
 * Sets local displayDay and displayWeek state to match store.
 *
 * @memberof NavigationMonth
 */
class NavigationMonth extends Component {
  state = {
    displayDay: scheduleStore.displayDay,
    displayWeek: scheduleStore.displayWeek,
    displayMonth: scheduleStore.displayMonth
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
   * @memberof NavigationMonth
   */
  refreshNavigation = () => {
    this.setState({
      displayDay: scheduleStore.displayDay,
      displayWeek: scheduleStore.displayWeek,
      displayMonth: scheduleStore.displayMonth
    });
  };

  /**
   * Function set current date to given date using gotoDay action
   *
   * @param {date} newDate
   * @memberof NavigationMonth
   */
  handleDateClick = newDate => e => {
    scheduleActions.gotoDay(newDate);
  };

  /**
   * Function that  changes day by calling gotoDay action.
   * Before calling gotoDay Goes to first Monday of the month before current date.
   *
   * @memberof NavigationMonth
   */
  handleMonthBackClick = e => {
    const nextDate = subMonths(this.state.displayDay, 1);
    const firstOfMonth = startOfMonth(nextDate);
    var firstOfWeek = startOfWeek(firstOfMonth, { weekStartsOn: 1 });
    if (!isSameMonth(firstOfMonth, firstOfWeek))
      firstOfWeek = addWeeks(firstOfWeek, 1);
    scheduleActions.gotoDay(firstOfWeek);
  };

  /**
   * Function that  changes day by calling gotoDay action.
   * Before calling gotoDay Goes to first Monday of the month after current date.
   *
   * @memberof NavigationMonth
   */
  handleMonthForwardClick = e => {
    const nextDate = addMonths(this.state.displayDay, 1);
    const firstOfMonth = startOfMonth(nextDate);
    var firstOfWeek = startOfWeek(firstOfMonth, { weekStartsOn: 1 });
    if (!isSameMonth(firstOfMonth, firstOfWeek))
      firstOfWeek = addWeeks(firstOfWeek, 1);
    scheduleActions.gotoDay(firstOfWeek);
  };

  render() {
    return (
      <Fragment>
        <div className="arrow">
          <IconButton
            onClick={this.handleMonthBackClick}
            aria-label="WeekBack"
            color="inherit"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </div>
        <div className="calendarContainer">
          {this.state.displayWeek.map(date => (
            <div className="name" key={date + format(date, 'dd')} name={date}>
              {format(date, 'dd')}
            </div>
          ))}
          {this.state.displayMonth.map(week =>
            week.map(date => (
              <ButtonBase
                key={date}
                className={`DayButtonBase day ${
                  isSameDay(date, this.state.displayDay) ? 'active' : ''
                } ${isToday(date) ? 'today' : ''}`}
                name={date}
                onClick={this.handleDateClick(date)}
                color="inherit"
              >
                <div className="date">{format(date, 'D')}</div>
              </ButtonBase>
            ))
          )}
        </div>
        <div className="arrow">
          <IconButton
            onClick={this.handleMonthForwardClick}
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

export default NavigationMonth;
