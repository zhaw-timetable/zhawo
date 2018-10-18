// @flow

import React, { Component } from 'react';
import { format, isToday } from 'date-fns';

import './Calendar.sass';

import * as globalActions from '../../actions/GlobalActions';
import * as timetableActions from '../../actions/TimetableActions';

import globalStore from '../../stores/GlobalStore';
import timetableStore from '../../stores/TimetableStore';

type Props = {};
type State = { displayDate: Date, displayWeek: any };

class Calendar extends Component<Props, State> {
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
        <div className="days">
          {this.state.displayWeek.map(date => (
            <div className="day" key={date}>
              {format(date, 'dd')}
            </div>
          ))}
        </div>
        <div className="dates">
          <div className="week">
            {this.state.displayWeek.map(date => (
              <div
                className={`date ${isToday(date) ? 'active' : ''}`}
                key={date}
              >
                {format(date, 'D')}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
