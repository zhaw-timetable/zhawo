import React, { Component, Fragment } from 'react';
import { addDays, getDay } from 'date-fns';
import Swipe from 'react-easy-swipe';
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
    isDayView: globalStore.isDayView,
    swipeInX: 0
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

  onSwipeStart = event => {
    this.setState({ swipeInX: 0 });
  };

  onSwipeMove = (position, event) => {
    this.setState({ swipeInX: position.x });
  };

  onSwipeEnd = event => {
    //TODO: adjust behaviour for WeekView
    let { swipeInX } = this.state;
    if (swipeInX > 160) {
      //THis is because ScheduleStore goes to Monday when Sunday is the day
      //TODO: make this cleaner, move logic to Store by creating function
      // to go ahead or back one day
      if (getDay(scheduleStore.displayDay) == 1) {
        scheduleActions.gotoDay(addDays(scheduleStore.displayDay, -2));
      } else {
        scheduleActions.gotoDay(addDays(scheduleStore.displayDay, -1));
      }
    } else if (swipeInX < -160) {
      scheduleActions.gotoDay(addDays(scheduleStore.displayDay, 1));
    }
  };

  render() {
    return (
      <Fragment>
        <AppBarContainer>
          <ScheduleContextMenu />
        </AppBarContainer>
        <Swipe onSwipeMove={this.onSwipeMove} onSwipeEnd={this.onSwipeEnd}>
          <div className="ScheduleContainer">
            {!this.state.isOpen && <NavigationWeek />}
            {this.state.isOpen && <NavigationMonth />}
            {/* Todo remove gripper in week view and change function of arrows*/}
            <div id="Gripper" onClick={this.toggleMonthView} />
            {this.state.isDayView && <LessonDay />}
            {!this.state.isDayView && <LessonWeek />}
          </div>
        </Swipe>
      </Fragment>
    );
  }
}

export default Schedule;
