import React, { Component, Fragment } from 'react';
import { format, startOfWeek } from 'date-fns';

import './LessonDay.sass';

import scheduleStore from '../../../../stores/ScheduleStore';

import EventDetailDialog from '../EventDetailDialog/EventDetailDialog';

class LessonDay extends Component {
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

  getDayKey = displayDay => {
    return format(displayDay, 'YYYY-MM-DD');
  };

  render() {
    const {
      displayDay,
      schedule,
      eventDetailsOpen,
      eventForDetails,
      activeSlot
    } = this.state;
    const weekKey = this.getWeekKey(displayDay);
    const dayKey = this.getDayKey(displayDay);
    return (
      <Fragment>
        {eventDetailsOpen && (
          <EventDetailDialog
            open={true}
            event={eventForDetails}
            handleClose={this.handleCloseEventDetails}
          />
        )}
        {schedule &&
          schedule.weeks &&
          schedule.weeks[weekKey][dayKey] &&
          schedule.weeks[weekKey][dayKey].slots &&
          schedule.weeks[weekKey][dayKey].slots.map((slot, index) => (
            <Fragment key={index}>
              <Slots
                activeSlot={activeSlot}
                startTime={slot.startTime}
                endTime={slot.endTime}
              />
              <EventBucketFlex
                slot={slot}
                index={index}
                handleEventClick={this.handleEventClick}
              />
            </Fragment>
          ))}
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

const EventBucketFlex = ({ slot, index, handleEventClick }) => {
  const { eventBucket, longestEvent } = slot;
  const gridRowStart = `${index + 1}`;
  const gridRowEnd = `${index + 1 + slot.longestEvent}`;
  const styles = { gridRow: `${gridRowStart} / ${gridRowEnd}` };
  return (
    <div className="EventBucketFlex" style={styles} key={index}>
      {eventBucket &&
        eventBucket.map((event, j) => {
          return (
            <EventBucketGrid
              event={event}
              longestEvent={longestEvent}
              handleEventClick={handleEventClick}
              key={j}
            />
          );
        })}
    </div>
  );
};

const EventBucketGrid = ({ event, longestEvent, handleEventClick }) => {
  const rows = '1fr '.repeat(longestEvent);
  return (
    <div
      className="EventBucketGrid"
      style={{
        gridTemplateRows: rows
      }}
    >
      <div
        className="LessonDayEvent"
        key={format(event.startTime, 'HH:mm').concat(event.name)}
        onClick={handleEventClick(event)}
        style={{
          gridRow: `${event.offSetFromBucketStart +
            1} / ${event.offSetFromBucketStart + 1 + event.slots.length}`
        }}
      >
        <div className="EventInfo">{event.name}</div>
        <div className="EventRoom">
          {event.eventRealizations &&
            event.eventRealizations[0] &&
            event.eventRealizations[0].room &&
            event.eventRealizations[0].room.name}
        </div>
      </div>
    </div>
  );
};

export default LessonDay;
