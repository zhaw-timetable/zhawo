import React, { Component } from 'react';
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

  handleWeekBackClick = e => {
    const newDate = subWeeks(this.state.displayDay, 1);
    scheduleActions.gotoDay(newDate);
  };

  handleWeekForwardClick = e => {
    const newDate = addWeeks(this.state.displayDay, 1);
    scheduleActions.gotoDay(newDate);
  };

  handleMonthClick = e => {
    console.log('TODO: integrate month navigation here');
  };

  render() {
    return (
      <div className="NavigationMonth">
        <div className="arrow">
          <IconButton
            onClick={this.handleWeekBackClick}
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
                <div className="date">{format(date, 'D')}.</div>
              </ButtonBase>
            ))
          )}
        </div>
        <div className="arrow">
          <IconButton
            onClick={this.handleWeekForwardClick}
            aria-label="WeekForward"
            color="inherit"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default NavigationMonth;
