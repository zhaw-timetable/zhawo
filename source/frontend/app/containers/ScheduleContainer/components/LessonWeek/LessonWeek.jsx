import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './LessonWeek.sass';

import * as globalActions from '../../../../actions/GlobalActions';
import globalStore from '../../../../stores/GlobalStore.js';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

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
    return (
      <div className="LessonWeek LessonContainer">
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
      </div>
    );
  }
}

export default LessonWeek;
