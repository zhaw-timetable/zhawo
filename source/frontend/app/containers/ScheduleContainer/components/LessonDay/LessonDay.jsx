import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './LessonDay.sass';

import * as globalActions from '../../../../actions/GlobalActions';
import globalStore from '../../../../stores/GlobalStore.js';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

class LessonDay extends Component {
  state = {
    // Todo: bigger interval and set activeSlot on Mount and Fix seTState before mount
    timer: setInterval(this.timer.bind(this), 1000),
    activeSlot: '',
    slots: scheduleStore.slots,
    scheduleForDisplayDay: scheduleStore.scheduleForDisplayDay
  };

  componentWillMount() {
    scheduleStore.on('schedule_changed', this.refreshSchedule);
  }

  componentWillUnmount() {
    scheduleStore.removeListener('schedule_changed', this.refreshSchedule);
  }

  refreshSchedule = () => {
    this.setState({
      slots: scheduleStore.slots,
      scheduleForDisplayDay: scheduleStore.scheduleForDisplayDay
    });
  };

  getTimeSlot(slots) {
    const now = format(new Date(), 'HH:mm');

    for (var slot in slots) {
      if (format(slots[slot].endTime, 'HH:mm') > now) {
        return format(slots[slot].endTime, 'HH:mm');
      }
    }

    return null;
  }

  timer() {
    this.setState({
      activeSlot: this.getTimeSlot(this.state.slots)
    });
  }

  render() {
    return (
      <Fragment>
        {this.state.slots &&
          this.state.slots.map(slot => (
            <Fragment key={format(slot.startTime, 'HH:mm')}>
              <div
                className={
                  'SlotTime ' +
                  (this.state.activeSlot == format(slot.endTime, 'HH:mm'))
                }
              >
                <div className="SlotStartTime">
                  {format(slot.startTime, 'HH:mm')}
                </div>
                <div className="SlotEndTime">
                  {format(slot.endTime, 'HH:mm')}
                </div>
              </div>
            </Fragment>
          ))}
        {this.state.scheduleForDisplayDay &&
          this.state.scheduleForDisplayDay.events.map(event => (
            <Fragment key={format(event.startTime, 'HH:mm').concat(event.name)}>
              <div
                className="LessonDayEvent"
                style={{
                  gridRowStart: event.startSlot + 3,
                  gridRowEnd: event.endSlot + 3
                }}
              >
                <div className="EventInfo">{event.name}</div>
                <div className="EventRoom">
                  {event.eventRealizations[0] &&
                    event.eventRealizations[0].room &&
                    event.eventRealizations[0].room.name}
                </div>
              </div>
            </Fragment>
          ))}
      </Fragment>
    );
  }
}

export default LessonDay;
