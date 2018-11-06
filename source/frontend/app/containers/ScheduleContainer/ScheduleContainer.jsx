import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './ScheduleContainer.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import NavigationWeek from './components/NavigationWeek.jsx/NavigationWeek';

class Schedule extends Component {
  state = {
    slots: scheduleStore.slots,
    scheduleForDisplayDay: scheduleStore.scheduleForDisplayDay
  };

  componentDidMount() {
    if (!scheduleStore.schedule) {
      scheduleActions.getSchedule(
        globalStore.currentUserType,
        globalStore.currentUser,
        scheduleStore.currentDate
      );
    }
  }

  componentWillMount() {
    scheduleStore.on('schedule_changed', this.refreshSchedule);
    // globalStore.on('current_user_changed', this.handleUsernameChanged);
  }

  componentWillUnmount() {
    scheduleStore.removeListener('schedule_changed', this.refreshSchedule);
    // globalStore.removeListener(
    //   'current_user_changed',
    //   this.handleUsernameChanged
    // );
  }

  refreshSchedule = () => {
    this.setState({
      slots: scheduleStore.slots,
      scheduleForDisplayDay: scheduleStore.scheduleForDisplayDay
    });
  };

  // handleUsernameChanged = () => {
  //   console.log('Username changed');
  //   const currentDate = new Date();
  //   // only reload if scheduleStore doesnt have the data yet
  //   if (!scheduleStore.schedule) {
  //     console.log('Getting timetable for ' + globalStore.currentUser);
  //     scheduleActions.getSchedule(
  //       globalStore.currentUserType,
  //       globalStore.currentUser,
  //       scheduleStore.currentDate
  //     );
  //   }
  // };

  render() {
    return (
      <div className="ScheduleContainer">
        <NavigationWeek />
        <div className="LessonContainer">
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
          {this.state.scheduleForDisplayDay &&
            this.state.scheduleForDisplayDay.events.map(event => (
              <Fragment
                key={format(event.startTime, 'HH:mm').concat(event.name)}
              >
                <div
                  className="Event"
                  style={{
                    gridRowStart: event.startSlot + 1,
                    gridRowEnd: event.endSlot + 1
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
        </div>
      </div>
    );
  }
}

export default Schedule;
