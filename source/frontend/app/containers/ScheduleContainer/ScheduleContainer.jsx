import React, { Component, Fragment } from 'react';
import './ScheduleContainer.sass';

import Swipe from 'react-easy-swipe';

import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import globalStore from '../../stores/GlobalStore';

import vszhawStore from '../../stores/VsZhawStore';
import * as vszhawActions from '../../actions/VsZhawActions';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import NavigationWeek from './components/NavigationWeek/NavigationWeek';
import LessonDay from './components/LessonDay/LessonDay';
import LessonWeek from './components/LessonWeek/LessonWeek';
import ScheduleContextMenu from './components/ScheduleContextMenu/ScheduleContextMenu';

/**
 * Schedule Component
 * Displays the schedule for the current user.
 * User can swipe between days/weeks.
 *
 * @class Schedule
 * @extends {Component}
 */
class Schedule extends Component {
  state = {
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
    if (!(vszhawStore.events.length > 0)) {
      vszhawActions.getVszhawEvents();
    }
  }

  componentWillMount() {
    globalStore.on('isDayView_changed', this.handleView);
  }

  componentWillUnmount() {
    globalStore.removeListener('isDayView_changed', this.handleView);
  }

  /**
   * Function that toggles local isOpen state.
   *
   * @memberof Schedule
   */
  toggleMonthView = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  /**
   * Function that is called when store changes.
   * Sets local isDayView to match store.
   *
   * @memberof Schedule
   */
  handleView = () => {
    this.setState({ isDayView: globalStore.isDayView });
  };

  /**
   * Function that sets local swipeInX state to 0.
   * Used to swipe.
   *
   * @memberof Schedule
   */
  onSwipeStart = event => {
    this.setState({ swipeInX: 0 });
  };

  /**
   * Function that sets local swipeInX state.
   * Used to swipe.
   *
   * @memberof Schedule
   */
  onSwipeMove = (position, event) => {
    this.setState({ swipeInX: position.x });
  };

  /**
   * Function that sets local swipeInX state.
   * Used to swipe.
   *
   * @memberof Schedule
   */
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
          <Hidden mdUp>
            <Typography variant="h6" color="inherit" className="flex">
              ZHAWo
            </Typography>
          </Hidden>
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
              <NavigationWeek />
            </div>
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
