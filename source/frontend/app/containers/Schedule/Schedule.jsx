import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './Schedule.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import Calendar from '../Calendar/Calendar';

class Schedule extends Component {
  state = {
    month: globalStore.getUsername(),
    slots: scheduleStore.slots,
    schedule: scheduleStore.scheduleDisplayDate,
    username: globalStore.getUsername()
  };

  componentDidMount() {
    const currentDate = new Date();
    scheduleActions.getSchedule(
      'students',
      globalStore.getUsername(),
      currentDate
    );
  }

  // Bind change listener
  componentWillMount() {
    globalStore.on('name_changed', this.refreshName);
    scheduleStore.on('timetable_changed', this.refreshSchedule);
  }

  // Unbind change listener
  componentWillUnmount() {
    globalStore.removeListener('name_changed', this.refreshName);
    scheduleStore.removeListener('timetable_changed', this.refreshSchedule);
  }

  refreshName = () => {
    this.setState({
      month: globalStore.getUsername()
    });
  };

  refreshSchedule = () => {
    this.setState({
      slots: scheduleStore.slots,
      schedule: scheduleStore.scheduleDisplayDate
    });
  };

  render() {
    return (
      <div className="Schedule">
        <Calendar />
        {this.state.slots &&
          this.state.slots.map(slot => (
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
        {this.state.schedule &&
          this.state.schedule.events.map(event => (
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

export default Schedule;
