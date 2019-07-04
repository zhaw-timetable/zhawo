import React, { Component, Fragment } from 'react';
import { format, startOfWeek, isSameDay } from 'date-fns';

import './LessonDay.sass';

import scheduleStore from '../../../../stores/ScheduleStore';
import vszhawStore from '../../../../stores/VsZhawStore';

import EventDetailDialog from '../EventDetailDialog/EventDetailDialog';
import VszhawEvent from '../VszhawEvent/VszhawEvent';

/**
 * Lesson Day Component
 * Lesson information container for one day.
 *
 * @class LessonDay
 * @extends {Component}
 */
class LessonDay extends Component {
  state = {
    activeSlot: '',
    slots: scheduleStore.slots,
    displayDay: scheduleStore.displayDay,
    schedule: scheduleStore.schedule,
    eventDetailsOpen: false,
    eventForDetails: null,
    vszhawEvents: vszhawStore.events
  };

  componentWillMount() {
    scheduleStore.on('schedule_changed', this.refreshSchedule);
    vszhawStore.on('got_vszhaw_events', this.setEvents);
  }

  componentWillUnmount() {
    scheduleStore.removeListener('schedule_changed', this.refreshSchedule);
    vszhawStore.removeListener('got_vszhaw_events', this.setEvents);
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

  /**
   * Function called on store change.
   * Sets local vszhawEvents state to match store events state
   *
   * @memberof LessonDay
   */
  setEvents = () => {
    this.setState({
      vszhawEvents: vszhawStore.events
    });
  };

  /**
   * Function called when store changes.
   * Sets local slots, displayDay and schedule states to match store.
   *
   * @memberof LessonDay
   */
  refreshSchedule = () => {
    this.setState({
      displayDay: scheduleStore.displayDay,
      schedule: scheduleStore.schedule
    });
  };

  /**
   * Slot Object
   * @typedef {Object} slot
   * @property {string} endTime
   * @property {string} startTime
   */

  /**
   * Function that returns current time slot in a given list of time slots.
   *
   * @param {slot[]} slots
   * @memberof LessonDay
   */
  getTimeSlot = slots => {
    const now = format(new Date(), 'HH:mm');
    for (var slot in slots) {
      if (format(slots[slot].endTime, 'HH:mm') > now) {
        return format(slots[slot].endTime, 'HH:mm');
      }
    }
    return null;
  };

  /**
   * Function that start a timer that updates activeSlot state every 60000 milliseconds.
   * Local activeSlot state is set to current time slot using getTimeSlot.
   *
   * @memberof LessonDay
   */
  startTimer() {
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        this.setState({
          activeSlot: this.getTimeSlot(this.state.slots)
        });
      }, 60000);
    }
  }

  /**
   * Ends interval started using startTimer.
   *
   * @memberof LessonDay
   */
  stopTimer() {
    clearInterval(this.timerId);
  }

  /**
   * Function that sets local eventDetailsOpen state to true and eventForDetails to the given param, after checking if the clicked event contains actual information (not. f.ex. holiday).
   * Doing so will cause model to open.
   *
   * @memberof LessonDay
   */
  handleEventClick = param => e => {
    // Check if it is event with actual information (not. f.ex. holiday)
    if (param.eventRealizations && param.eventRealizations.length > 0) {
      this.setState({ eventDetailsOpen: true, eventForDetails: param });
    }
  };

  /**
   * Function that sets local eventDetailsOpen state to false and eventForDetails to null.
   * Doing so will cause model to close.
   *
   * @memberof LessonDay
   */
  handleCloseEventDetails = () => {
    this.setState({ eventDetailsOpen: false, eventForDetails: null });
  };

  /**
   * Function will return the first day of the week for the given date formatted as YYYY-MM-DD
   *
   * @param {Date} displayDay
   * @memberof LessonDay
   */
  getWeekKey = displayDay => {
    return format(startOfWeek(displayDay, { weekStartsOn: 1 }), 'YYYY-MM-DD');
  };

  /**
   * Function will return the given date formatted as YYYY-MM-DD
   * @param {Date} displayDay
   * @memberof LessonDay
   */
  getDayKey = displayDay => {
    return format(displayDay, 'YYYY-MM-DD');
  };

  /**
   * Function returns the next vszhawEvents, if one exists during current week.
   *
   * @memberof LessonDay
   */
  checkForVszhawEvent = () => {
    const { vszhawEvents, displayDay } = this.state;
    if (!(vszhawEvents.length > 0)) return false;
    let onThisDay = isSameDay(
      new Date(this.state.displayDay),
      new Date(this.state.vszhawEvents[0].eventDate)
    );
    return onThisDay;
  };

  render() {
    const {
      slots,
      displayDay,
      schedule,
      eventDetailsOpen,
      eventForDetails,
      activeSlot,
      vszhawEvents
    } = this.state;
    const weekKey = this.getWeekKey(displayDay);
    const dayKey = this.getDayKey(displayDay);
    const isThereScheduleData =
      schedule &&
      schedule.weeks &&
      schedule.weeks[weekKey] &&
      schedule.weeks[weekKey][dayKey] &&
      schedule.weeks[weekKey][dayKey].slots;
    const isThereVszhawEvent = this.checkForVszhawEvent();
    return (
      <Fragment>
        {eventDetailsOpen && (
          <EventDetailDialog
            open={true}
            event={eventForDetails}
            handleClose={this.handleCloseEventDetails}
          />
        )}
        {!isThereScheduleData &&
          slots.map((slot, index) => (
            <Fragment key={index}>
              <Slots
                activeSlot={activeSlot}
                startTime={slot.startTime}
                endTime={slot.endTime}
              />
            </Fragment>
          ))}
        {isThereScheduleData &&
          schedule.weeks[weekKey][dayKey].slots.map((slot, index) => (
            <Fragment key={index}>
              <Slots
                activeSlot={activeSlot}
                startTime={slot.startTime}
                endTime={slot.endTime}
              />
            </Fragment>
          ))}
        {isThereScheduleData &&
          schedule.weeks[weekKey][dayKey].slots.map((slot, index) => (
            <Fragment key={index}>
              <EventBucketFlex
                slot={slot}
                index={index}
                handleEventClick={this.handleEventClick}
              />
            </Fragment>
          ))}
        {isThereVszhawEvent && <VszhawEvent event={vszhawEvents[0]} dayView />}
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
