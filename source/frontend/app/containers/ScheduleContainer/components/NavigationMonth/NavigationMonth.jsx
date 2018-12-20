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

//TODO: display current month somewhere

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

  refreshNavigation = () => {
    this.setState({
      displayDay: scheduleStore.displayDay,
      displayWeek: scheduleStore.displayWeek,
      displayMonth: scheduleStore.displayMonth
    });
  };

  handleDateClick = newDate => e => {
    scheduleActions.gotoDay(newDate);
  };

  // TODO: Move next 2 functions to Store
  // Goes to first monday of last month
  handleMonthBackClick = e => {
    const nextDate = subMonths(this.state.displayDay, 1);
    console.log('newDate', nextDate);
    const firstOfMonth = startOfMonth(nextDate);
    console.log('firstOfMonth', firstOfMonth);
    var firstOfWeek = startOfWeek(firstOfMonth, { weekStartsOn: 1 });
    if (!isSameMonth(firstOfMonth, firstOfWeek))
      firstOfWeek = addWeeks(firstOfWeek, 1);
    console.log('First of week', firstOfWeek);

    scheduleActions.gotoDay(firstOfWeek);
  };
  // Goes to first monday of next month
  handleMonthForwardClick = e => {
    const nextDate = addMonths(this.state.displayDay, 1);
    console.log('newDate', nextDate);
    const firstOfMonth = startOfMonth(nextDate);
    console.log('firstOfMonth', firstOfMonth);
    var firstOfWeek = startOfWeek(firstOfMonth, { weekStartsOn: 1 });
    if (!isSameMonth(firstOfMonth, firstOfWeek))
      firstOfWeek = addWeeks(firstOfWeek, 1);
    console.log('First of week', firstOfWeek);

    scheduleActions.gotoDay(firstOfWeek);
  };

  handleMonthClick = e => {
    console.log('TODO: integrate month navigation here');
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
