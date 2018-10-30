import React, { Component, Fragment } from 'react';
import './DayViewTimetable.sass';

import { format } from 'date-fns';

class DayViewTimetable extends Component {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <Fragment>
        {this.props.timetable &&
          this.props.timetable.slots.map(slot => (
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
        {this.props.timetable &&
          this.props.timetable.events.map(event => (
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
      </Fragment>
    );
  }
}

export default DayViewTimetable;
