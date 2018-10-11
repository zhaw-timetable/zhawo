// @flow

import React, { Component } from 'react';
import './Timetable.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

import Calendar from '../Calendar/Calendar.js';

type Props = {};
type State = { month: any, hours: any };

class Timetable extends Component<Props, State> {
  state = {
    month: Store.getName(),
    hours: [
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:50',
      '09:35',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:50',
      '09:35',
      '09:35'
    ]
  };

  // Bind change listener
  componentWillMount() {
    Store.on('name_changed', this.refreshName);
  }

  // Unbind change listener
  componentWillUnmount() {
    Store.removeListener('name_changed', this.refreshName);
  }

  refreshName = () => {
    this.setState({
      month: Store.getName()
    });
  };

  render() {
    return (
      <div className="Timetable">
        <Calendar month={this.state.month} />
        {this.state.hours.map(h => (
          <div className="Hour" key={h.concat(Math.random().toString())} id={h}>
            {h}
          </div>
        ))}
        <div className="Lesson Lesson1">MKR</div>
        <div className="Lesson Lesson2">MKR</div>
        <div className="Lesson Lesson3">MKR</div>
      </div>
    );
  }
}

export default Timetable;
