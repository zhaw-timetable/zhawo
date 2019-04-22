import React, { Component, Fragment } from 'react';
import { format, startOfWeek, getDay } from 'date-fns';

import './LessonWeek.sass';

import * as globalActions from '../../../../actions/GlobalActions';
import globalStore from '../../../../stores/GlobalStore.js';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

import EventDetailDialog from '../EventDetailDialog/EventDetailDialog';

class LessonWeek extends Component {
  state = {
    activeSlot: '',
    slots: scheduleStore.slots,
    displayDay: scheduleStore.displayDay,
    schedule: scheduleStore.schedule,
    eventDetailsOpen: false,
    eventForDetails: null
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
      slots: scheduleStore.slots,
      displayDay: scheduleStore.displayDay,
      schedule: scheduleStore.schedule
    });
  };

  // returns the current TimeSlot
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

  handleEventClick = param => e => {
    // Check if it is event with actual information (not. f.ex. holiday)
    if (param.eventRealizations && param.eventRealizations.length > 0) {
      this.setState({ eventDetailsOpen: true, eventForDetails: param });
    }
  };

  handleCloseEventDetails = () => {
    this.setState({ eventDetailsOpen: false, eventForDetails: null });
  };

  getWeekKey = displayDay => {
    return format(startOfWeek(displayDay, { weekStartsOn: 1 }), 'YYYY-MM-DD');
  };

  render() {
    const {
      slots,
      displayDay,
      schedule,
      eventDetailsOpen,
      eventForDetails,
      activeSlot
    } = this.state;
    const weekKey = this.getWeekKey(displayDay);
    return (
      <Fragment>
        {eventDetailsOpen && (
          <EventDetailDialog
            open={true}
            event={eventForDetails}
            handleClose={this.handleCloseEventDetails}
          />
        )}
        {slots.map((slot, index) => (
          <Fragment key={index}>
            <Slots
              activeSlot={activeSlot}
              startTime={slot.startTime}
              endTime={slot.endTime}
            />
          </Fragment>
        ))}
        {schedule &&
          schedule.weeks &&
          schedule.weeks[weekKey] &&
          Object.entries(schedule.weeks[weekKey]).map(([key, day, dayNr]) =>
            day.slots.map(
              (slot, i) =>
                slot.eventBucket &&
                slot.eventBucket.map((event, j) => {
                  if (j === 0) {
                    return (
                      <Fragment
                        key={format(slot.startTime, 'HH:mm').concat(event.name)}
                      >
                        <div
                          className="LessonWeekEvent"
                          onClick={this.handleEventClick(event)}
                          style={{
                            gridColumnStart: 1 + getDay(new Date(key)),
                            gridRow: `${i + 1} / ${i + 1 + event.slots.length}`
                          }}
                        >
                          <div className="EventInfo">{event.name}</div>
                          <br />
                          <div className="EventRoom">
                            {event.eventRealizations &&
                              event.eventRealizations[0] &&
                              event.eventRealizations[0].room &&
                              event.eventRealizations[0].room.name}
                          </div>
                          <br />
                          {slot.eventBucket.length > 1 && (
                            <div className="EventMore">
                              {slot.eventBucket.length} Events
                            </div>
                          )}
                        </div>
                      </Fragment>
                    );
                  }
                })
            )
          )}
      </Fragment>
    );
  }
}

const Slots = ({ activeSlot, startTime, endTime }) => (
  <div className={'SlotTime ' + (activeSlot == format(endTime, 'HH:mm'))}>
    <div className="SlotStartTime">{format(startTime, 'HH:mm')}</div>
    <div className="SlotEndTime">{format(endTime, 'HH:mm')}</div>
  </div>
);

export default LessonWeek;
