import React, { Component, Fragment } from 'react';
import './Timetable.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import timetableStore from '../../stores/TimetableStore';
import * as timetableActions from '../../actions/TimetableActions';

import Calendar from '../Calendar/Calendar';
import DayViewTimetable from '../DayViewTimetable/DayViewTimetable';

class Timetable extends Component {
  state = {
    month: globalStore.getUsername(),
    timetable: timetableStore.timetableDisplayDate,
    username: globalStore.getUsername()
  };

  componentDidMount() {
    const currentDate = new Date();
    timetableActions.getTimetableByUsername(this.state.username, currentDate);
  }

  // Bind change listener
  componentWillMount() {
    globalStore.on('name_changed', this.refreshName);
    timetableStore.on('timetable_changed', this.refreshTimetable);
  }

  // Unbind change listener
  componentWillUnmount() {
    globalStore.removeListener('name_changed', this.refreshName);
    timetableStore.removeListener('timetable_changed', this.refreshTimetable);
  }

  refreshName = () => {
    this.setState({
      month: globalStore.getUsername()
    });
  };

  refreshTimetable = () => {
    this.setState({
      timetable: timetableStore.timetableDisplayDate
    });
  };

  render() {
    return (
      <div className="Timetable">
        <Calendar />
        <DayViewTimetable timetable={this.state.timetable} />
      </div>
    );
  }
}

export default Timetable;
