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
    displayWeek: timetableStore.displayWeek,
    displayMonth: timetableStore.displayMonth,
    isOpen: false
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
      displayWeek: timetableStore.displayWeek,
      displayMonth: timetableStore.displayMonth
    });
  };

  toggleMonthView = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <div className="Calendar">
        {this.state.isOpen && (
          <div className="week monthView">
            {this.state.displayWeek.map(date => (
              <div
                className={`name  ${isToday(date) ? 'today' : ''}`}
                key={date + format(date, 'dd')}
                name={date}
              >
                {format(date, 'dd')}
              </div>
            ))}
            {this.state.displayMonth.map(week =>
              week.map(date => (
                <div
                  className={`date ${
                    isSameDay(date, this.state.displayDate) ? 'active' : ''
                  } ${isToday(date) ? 'today' : ''}`}
                  key={date}
                  name={date}
                  onClick={() => timetableActions.gotoDay(date)}
                >
                  {format(date, 'D')}
                </div>
              ))
            )}
          </div>
        )}

        {!this.state.isOpen && (
          <div className="week weekView">
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
        )}
        <div id="Gripper" onClick={() => this.toggleMonthView()} />
      </div>
    );
  }
}

export default Calendar;
