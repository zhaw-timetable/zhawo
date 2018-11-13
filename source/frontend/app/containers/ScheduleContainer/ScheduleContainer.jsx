import React, { Component, Fragment } from 'react';
import './ScheduleContainer.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import NavigationWeek from './components/NavigationWeek/NavigationWeek';
import NavigationMonth from './components/NavigationMonth/NavigationMonth';
import LessonDay from './components/LessonDay/LessonDay';
import LessonWeek from './components/LessonWeek/LessonWeek';
import ScheduleContextMenu from './components/ScheduleContextMenu/ScheduleContextMenu';

class Schedule extends Component {
  state = {
    isOpen: false,
    isDayView: globalStore.isDayView
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
    globalStore.on('isDayView_changed', this.handleView);
    globalStore.on('current_user_loggedout', this.handleLogout);
  }

  componentWillUnmount() {
    globalStore.removeListener('isDayView_changed', this.handleView);
    globalStore.removeListener('current_user_loggedout', this.handleView);
  }

  toggleMonthView = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleView = () => {
    this.setState({ isDayView: globalStore.isDayView });
  };

  handleLogout = () => {
    this.forceUpdate();
  };

  render() {
    return (
      <Fragment>
        <AppBarContainer>
          <ScheduleContextMenu />
        </AppBarContainer>
        <div className="ScheduleContainer">
          {!this.state.isOpen && <NavigationWeek />}
          {this.state.isOpen && <NavigationMonth />}
          {/* Todo remove gripper in week view and change function of arrows*/}
          <div id="Gripper" onClick={this.toggleMonthView} />
          {this.state.isDayView && <LessonDay />}
          {!this.state.isDayView && <LessonWeek />}
        </div>
      </Fragment>
    );
  }
}

export default Schedule;
