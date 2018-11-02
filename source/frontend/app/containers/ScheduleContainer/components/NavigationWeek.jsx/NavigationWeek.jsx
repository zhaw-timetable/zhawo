import React, { Component } from 'react';
import { format, isToday, isSameDay, addWeeks, subWeeks } from 'date-fns';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import IconButton from '@material-ui/core/IconButton';

import './NavigationWeek.sass';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

//TODO: display current month somewhere

class Calendar extends Component {
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

  refreshNavigation = () => {
    this.setState({
      displayDay: scheduleStore.displayDay,
      displayWeek: scheduleStore.displayWeek
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

  render() {
    return (
      <div className="NavigationWeek">
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
                isSameDay(date, this.state.displayDay) ? 'active' : ''
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
