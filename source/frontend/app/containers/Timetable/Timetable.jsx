import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './Timetable.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import timetableStore from '../../stores/TimetableStore';
import * as timetableActions from '../../actions/TimetableActions';

import Calendar from '../Calendar/Calendar';

class Timetable extends Component {
  state = {
    month: globalStore.getUsername(),
    timetable: timetableStore.timetableDisplayDate,
    username: globalStore.getUsername()
  };

  componentDidMount() {}

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
        {this.state.timetable &&
          this.state.timetable.slots.map(slot => (
            <Fragment key={format(slot.startTime, 'HH:mm')}>
              <div className="SlotTime">
                <div className="SlotStartTime">
                  {format(slot.startTime, 'HH:mm')}
                </div>
                <div className="SlotEndTime">
                  {format(slot.endTime, 'HH:mm')}
                </div>
              </div>
            </Fragment>
          ))}
        {this.state.timetable &&
          this.state.timetable.events.map(event => (
            <Fragment key={format(event.startTime, 'HH:mm').concat(event.name)}>
              <div
                className="Event"
                style={{
                  gridRowStart: event.startSlot + 2,
                  gridRowEnd: event.endSlot + 2
                }}
              >
                {event.name}
              </div>
            </Fragment>
          ))}
      </div>
    );
  }
}

export default Timetable;
