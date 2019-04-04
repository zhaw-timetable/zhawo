import React, { Component, Fragment } from 'react';
import './ScheduleContainer.sass';

import Swipe from 'react-easy-swipe';

import globalStore from '../../stores/GlobalStore';

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
  }

  componentWillUnmount() {
    globalStore.removeListener('isDayView_changed', this.handleView);
  }

  toggleMonthView = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleView = () => {
    this.setState({ isDayView: globalStore.isDayView });
  };

  onSwipeStart = event => {
    this.setState({ swipeInX: 0 });
  };

  onSwipeMove = (position, event) => {
    this.setState({ swipeInX: position.x });
  };

  onSwipeEnd = event => {
    let { swipeInX } = this.state;
    if (swipeInX > window.innerWidth / 4) {
      scheduleActions.swipeLeft();
    } else if (swipeInX < -window.innerWidth / 4) {
      scheduleActions.swipeRight();
    }
  };

  render() {
    return (
      <Fragment>
        <AppBarContainer>
          <ScheduleContextMenu />
        </AppBarContainer>
        <Swipe
          onSwipeMove={this.onSwipeMove}
          onSwipeEnd={this.onSwipeEnd}
          onSwipeStart={this.onSwipeStart}
          className="ContentWrapper"
        >
          <div className="ScheduleContainer">
            <div className="NavigationContainer">
              {!this.state.isOpen && <NavigationWeek />}
              {this.state.isOpen && <NavigationMonth />}
            </div>
            {/* Todo remove gripper in week view and change function of arrows*/}
            {/* <div id="Gripper" onClick={this.toggleMonthView} /> */}
            <div className="TimetableContainer">
              {this.state.isDayView && <LessonDay />}
              {!this.state.isDayView && <LessonWeek />}
            </div>
          </div>
        </Swipe>
      </Fragment>
    );
  }
}

export default Schedule;
