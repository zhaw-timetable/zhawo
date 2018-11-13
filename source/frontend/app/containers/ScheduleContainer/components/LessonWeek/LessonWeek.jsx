import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './LessonWeek.sass';

import * as globalActions from '../../../../actions/GlobalActions';
import globalStore from '../../../../stores/GlobalStore.js';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

//TODO: fix this with new schedule stuff

class LessonWeek extends Component {
  state = {
    slots: scheduleStore.slots,
    scheduleForDisplayWeek: scheduleStore.scheduleForDisplayWeek
  };

  componentWillMount() {
    scheduleStore.on('schedule_changed', this.refreshSchedule);
  }

  componentWillUnmount() {
    scheduleStore.removeListener('schedule_changed', this.refreshSchedule);
  }

  refreshSchedule = () => {
    console.log(scheduleStore.scheduleForDisplayWeek);
    this.setState({
      slots: scheduleStore.slots,
      scheduleForDisplayWeek: scheduleStore.scheduleForDisplayWeek
    });
  };

  render() {
    var dayCount = 1;

    return (
      <Fragment>
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
        {this.state.scheduleForDisplayWeek &&
          this.state.scheduleForDisplayWeek.map(day =>
            day.events.map(event => (
              <Fragment
                key={format(event.startTime, 'HH:mm').concat(event.name)}
              >
                <div
                  className="LessonWeekEvent"
                  style={{
                    gridColumnStart: event.day + 1,
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
            ))
          )}
      </Fragment>
    );
  }
}

export default LessonWeek;
