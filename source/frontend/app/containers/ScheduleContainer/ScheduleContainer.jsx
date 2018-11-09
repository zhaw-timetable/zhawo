import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import './ScheduleContainer.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import NavigationWeek from './components/NavigationWeek/NavigationWeek';
import NavigationMonth from './components/NavigationMonth/NavigationMonth';

class Schedule extends Component {
  state = {
    slots: scheduleStore.slots,
    scheduleForDisplayDay: scheduleStore.scheduleForDisplayDay,
    isOpen: false
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

  toggleMonthView = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <div className="ScheduleContainer">
        {!this.state.isOpen && <NavigationWeek />}
        {this.state.isOpen && <NavigationMonth />}
        <div id="Gripper" onClick={this.toggleMonthView} />
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
