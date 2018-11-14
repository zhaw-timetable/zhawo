import React, { Component, Fragment } from 'react';
import { format, startOfWeek } from 'date-fns';

import './LessonDay.sass';

import * as globalActions from '../../../../actions/GlobalActions';
import globalStore from '../../../../stores/GlobalStore.js';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

class LessonDay extends Component {
  state = {
    activeSlot: '',
    slots: scheduleStore.slots,
    displayDay: scheduleStore.displayDay,
    schedule: scheduleStore.schedule
  };

  componentWillMount() {
    scheduleStore.on('schedule_changed', this.refreshSchedule);
  }

  componentWillUnmount() {
    scheduleStore.removeListener('schedule_changed', this.refreshSchedule);
    this.stopTimer();
  }

  componentDidMount() {
    // Check every x seconds if active slot is still active
    this.startTimer();
    // Set initial active slot once
    this.setState({
      activeSlot: this.getTimeSlot(this.state.slots)
    });
  }

  refreshSchedule = () => {
    this.setState({
      displayDay: scheduleStore.displayDay,
      schedule: scheduleStore.schedule
    });
  };

  getTimeSlot = slots => {
    const now = format(new Date(), 'HH:mm');
    for (var slot in slots) {
      if (format(slots[slot].endTime, 'HH:mm') > now) {
        return format(slots[slot].endTime, 'HH:mm');
      }
    }
    return null;
  };

  startTimer() {
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        this.setState({
          activeSlot: this.getTimeSlot(this.state.slots)
        });
      }, 60000);
    }
  }

  stopTimer() {
    clearInterval(this.timerId);
  }

  render() {
    const weekKey = format(
      startOfWeek(this.state.displayDay, { weekStartsOn: 1 }),
      'YYYY-MM-DD'
    );
    const dayKey = format(this.state.displayDay, 'YYYY-MM-DD');
    const isThereData =
      this.state.schedule !== null &&
      this.state.schedule.weeks !== undefined &&
      this.state.schedule.weeks[weekKey] !== undefined &&
      this.state.schedule.weeks[weekKey][dayKey] !== undefined;
    return (
      <Fragment>
        {!isThereData &&
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
        {isThereData &&
          this.state.schedule.weeks[weekKey][dayKey].slots.map((slot, i) => (
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
              <div
                className="EventFlexBox"
                style={{
                  gridRow: `${i + 3} / ${i + 3 + slot.longestEvent}`
                }}
              >
                {slot.events &&
                  slot.events.map((event, j) => {
                    return (
                      <Fragment
                        key={format(event.startTime, 'HH:mm').concat(
                          event.name
                        )}
                      >
                        <div
                          className="LessonDayEvent"
                          style={{
                            gridRow: `${i + 3} / ${i + 3 + event.slots.length}`
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
                    );
                  })}
              </div>
            </Fragment>
          ))}
      </Fragment>
    );
  }
}

export default LessonDay;
