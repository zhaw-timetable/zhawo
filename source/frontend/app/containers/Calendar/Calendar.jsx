import React, { Component } from 'react';
import { format, isToday, isSameDay } from 'date-fns';

import './Calendar.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import timetableStore from '../../stores/TimetableStore';
import * as timetableActions from '../../actions/TimetableActions';

class Calendar extends Component {
  state = {
    displayDate: timetableStore.displayDate,
    displayWeek: timetableStore.displayWeek
  };

  // Bind change listener
  componentWillMount() {
    timetableStore.on('timetable_changed', this.refreshNavigation);
  }

  // Unbind change listener
  componentWillUnmount() {
    timetableStore.on('timetable_changed', this.refreshNavigation);
  }

  refreshNavigation = () => {
    this.setState({
      displayDate: timetableStore.displayDate,
      displayWeek: timetableStore.displayWeek
    });
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
              onClick={() => timetableActions.gotoDay(date)}
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
