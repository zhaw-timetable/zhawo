import React, { Component } from 'react';
import './ScheduleContainer.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import NavigationWeek from './components/NavigationWeek/NavigationWeek';
import NavigationMonth from './components/NavigationMonth/NavigationMonth';
import LessonDay from './components/LessonDay/LessonDay';
import LessonWeek from './components/LessonWeek/LessonWeek';

class Schedule extends Component {
  state = {
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

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

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
        {/* Todo remove gripper in week view and change function of arrows*/}
        <div id="Gripper" onClick={this.toggleMonthView} />
        {/*<LessonWeek />*/}
        <LessonDay />
      </div>
    );
  }
}

export default Schedule;
