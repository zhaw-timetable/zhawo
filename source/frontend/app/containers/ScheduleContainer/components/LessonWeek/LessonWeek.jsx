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
  }

  refreshSchedule = () => {
    this.setState({
      slots: scheduleStore.slots,
      displayDay: scheduleStore.displayDay,
      schedule: scheduleStore.schedule
    });
  };

  handleEventClick = param => e => {
    this.setState({ eventDetailsOpen: true, eventForDetails: param });
  };

  handleCloseEventDetails = () => {
    this.setState({ eventDetailsOpen: false, eventForDetails: null });
  };

  render() {
    const weekKey = format(
      startOfWeek(this.state.displayDay, { weekStartsOn: 1 }),
      'YYYY-MM-DD'
    );
    const dayKey = format(this.state.displayDay, 'YYYY-MM-DD');
    const isThereData =
      this.state.schedule !== null &&
      this.state.schedule.weeks !== undefined &&
      this.state.schedule.weeks[weekKey] !== undefined;
    return (
      <Fragment>
        {this.state.eventDetailsOpen && (
          <EventDetailDialog
            open={true}
            event={this.state.eventForDetails}
            handleClose={this.handleCloseEventDetails}
          />
        )}
        {this.state.slots.map(slot => (
          <Fragment key={format(slot.startTime, 'HH:mm')}>
            <div className="SlotTime">
              <div className="SlotStartTime">
                {format(slot.startTime, 'HH:mm')}
              </div>
              <div className="SlotEndTime">{format(slot.endTime, 'HH:mm')}</div>
            </div>
          </Fragment>
        ))}
        {isThereData &&
          Object.entries(this.state.schedule.weeks[weekKey]).map(
            ([key, day, dayNr]) =>
              day.slots.map(
                (slot, i) =>
                  slot.events &&
                  slot.events.map((event, j) => (
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
                      </div>
                    </Fragment>
                  ))
              )
          )}
      </Fragment>
    );
  }
}

export default LessonWeek;
