import React, { Component } from 'react';
import { format, isToday, isSameDay, addWeeks, subWeeks } from 'date-fns';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import IconButton from '@material-ui/core/IconButton';

import './Calendar.sass';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

class Calendar extends Component {
  state = {
    displayDate: scheduleStore.displayDate,
    displayWeek: scheduleStore.displayWeek
  };

  // Bind change listener
  componentWillMount() {
    scheduleStore.on('timetable_changed', this.refreshNavigation);
  }

  // Unbind change listener
  componentWillUnmount() {
    scheduleStore.removeListener('timetable_changed', this.refreshNavigation);
  }

  refreshNavigation = () => {
    this.setState({
      displayDate: scheduleStore.displayDate,
      displayWeek: scheduleStore.displayWeek
    });
  };

  handleDateClick = newDate => e => {
    scheduleActions.gotoDay(newDate);
  };

  handleWeekBackClick = e => {
    const newDate = subWeeks(this.state.displayDate, 1);
    scheduleActions.gotoDay(newDate);
  };

  handleWeekForwardClick = e => {
    const newDate = addWeeks(this.state.displayDate, 1);
    scheduleActions.gotoDay(newDate);
  };

  render() {
    return (
      <div className="Calendar">
        <div className="week">
          <div className="arrow">
            <IconButton
              onClick={this.handleWeekBackClick}
              aria-label="WeekBack"
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          </div>
          {this.state.displayWeek.map(date => (
            <div
              className={`day ${
                isSameDay(date, this.state.displayDate) ? 'active' : ''
              } ${isToday(date) ? 'today' : ''}`}
              key={date}
              name={date}
              onClick={this.handleDateClick(date)}
            >
              <div className="name">{format(date, 'dd')}</div>
              <div className="date">{format(date, 'D')}</div>
            </div>
          ))}
          <div className="arrow">
            <IconButton
              onClick={this.handleWeekForwardClick}
              aria-label="WeekForward"
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
