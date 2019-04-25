import React, { Component, Fragment } from 'react';
import { format, startOfWeek, getDay, isSameWeek } from 'date-fns';

import './LessonWeek.sass';

import scheduleStore from '../../../../stores/ScheduleStore';
import vszhawStore from '../../../../stores/VsZhawStore';

import EventDetailDialog from '../EventDetailDialog/EventDetailDialog';
import VszhawEvent from '../VszhawEvent/VszhawEvent';

class LessonWeek extends Component {
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

  setEvents = () => {
    this.setState({
      vszhawEvents: vszhawStore.events
    });
  };

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

  checkForVszhawEvent = () => {
    const { vszhawEvents, displayDay } = this.state;
    if (!vszhawEvents.length > 0) return false;
    let duringThisWeek = isSameWeek(
      new Date(this.state.displayDay),
      new Date(this.state.vszhawEvents[0].eventDate)
    );
    return duringThisWeek;
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
        {isThereVszhawEvent && <VszhawEvent event={vszhawEvents[0]} />}
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
