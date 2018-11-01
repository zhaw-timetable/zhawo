import React, { Component } from 'react';
import { format, isToday, isSameDay } from 'date-fns';

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
    scheduleStore.on('timetable_changed', this.refreshNavigation);
  }

  refreshNavigation = () => {
    this.setState({
      displayDate: scheduleStore.displayDate,
      displayWeek: scheduleStore.displayWeek
    });
  };

  handleDateClick = date => e => {
    scheduleActions.gotoDay(date);
  };

  render() {
    return (
      <div className="Calendar">
        <div className="week">
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
        </div>
      </div>
    );
  }
}

export default Calendar;
