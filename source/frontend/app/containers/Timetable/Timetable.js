// @flow

import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './Timetable.sass';

import * as globalActions from '../../actions/GlobalActions';
import * as timetableActions from '../../actions/TimetableActions';

import globalStore from '../../stores/GlobalStore';
import timetableStore from '../../stores/TimetableStore';

import Calendar from '../Calendar/Calendar';

type Props = {};
type State = { month: any, timetable: any };

class Timetable extends Component<Props, State> {
  state = {
    name: globalStore.getName(),
    month: globalStore.getName(),
    timetable: null
  };

  componentDidMount() {
    const currentDate = format(new Date(), 'DD-MM-YYYY');
    const userName = 'bachmdo2';
    timetableActions.getTimetableByUsername(userName, currentDate);
  }

  // Bind change listener
  componentWillMount() {
    globalStore.on('name_changed', this.refreshName);
    timetableStore.on('timetable_changed', this.refreshTimetable);
  }

  // Unbind change listener
  componentWillUnmount() {
    globalStore.removeListener('name_changed', this.refreshName);
    timetableStore.on('timetable_changed', this.refreshTimetable);
  }

  refreshName = () => {
    this.setState({
      month: globalStore.getName()
    });
  };

  refreshTimetable = () => {
    this.setState({
      timetable: timetableStore.timetable
    });
  };

  render() {
    return (
      <div className="Timetable">
        <Calendar month={this.state.month} />
        {this.state.timetable &&
          this.state.timetable.days[0].slots.map(slot => (
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
          this.state.timetable.days[0].events.map(event => (
            <Fragment key={event.name}>
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
