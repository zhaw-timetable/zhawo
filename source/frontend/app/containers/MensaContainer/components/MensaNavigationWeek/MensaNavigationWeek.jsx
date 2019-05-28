import React, { Component, Fragment } from 'react';
import {
  format,
  isToday,
  isSameDay,
  addWeeks,
  subWeeks,
  getISOWeek
} from 'date-fns';
import * as deLocale from 'date-fns/locale/de/index.js';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';

import './MensaNavigationWeek.sass';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

/**
 * Mensa Navigation Week Component.
 * Navigation bar with the days of the week.
 * Used to switch between days.
 *
 * @class MensaNavigationWeek
 * @extends {Component}
 */
class MensaNavigationWeek extends Component {
  state = {
    displayDay: mensaStore.displayDay,
    displayWeek: mensaStore.displayWeek
  };

  componentWillMount() {
    mensaStore.on('menuplan_changed', this.refreshNavigation);
  }

  componentWillUnmount() {
    mensaStore.removeListener('menuplan_changed', this.refreshNavigation);
  }

  /**
   * Function called when store changes.
   * Sets local displayDay and displayWeek state to match store states.
   *
   * @memberof MensaNavigationWeek
   */
  refreshNavigation = () => {
    this.setState({
      displayDay: mensaStore.displayDay,
      displayWeek: mensaStore.displayWeek
    });
  };

  /**
   * Function that changes day by calling gotoDay action.
   *
   * @memberof MensaNavigationWeek
   */
  handleDateClick = newDate => e => {
    mensaActions.gotoDay(newDate);
  };

  /**
   * Function that  changes day by calling gotoDay action.
   * Before calling gotoDay it subtracts a week from the current date.
   *
   * @memberof MensaNavigationWeek
   */
  handleWeekBackClick = e => {
    const newDate = subWeeks(this.state.displayDay, 1);
    mensaActions.gotoDay(newDate);
  };

  /**
   * Function that  changes day by calling gotoDay action.
   * Before calling gotoDay it adds a week from the current date.
   *
   * @memberof MensaNavigationWeek
   */
  handleWeekForwardClick = e => {
    const newDate = addWeeks(this.state.displayDay, 1);
    mensaActions.gotoDay(newDate);
  };

  render() {
    return (
      <Fragment>
        <div className="arrow">
          <IconButton
            onClick={this.handleWeekBackClick}
            aria-label="WeekBack"
            color="inherit"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </div>
        {this.state.displayWeek.map(date => (
          <ButtonBase
            key={date}
            className={`DayButtonBase day ${
              isSameDay(date, this.state.displayDay) ? 'active' : ''
            } ${isToday(date) ? 'today' : ''}`}
            name={date}
            onClick={this.handleDateClick(date)}
            color="inherit"
          >
            <div className="name">
              {format(date, 'dd', { locale: deLocale })}
            </div>
            <div className="date">
              {format(date, 'D')}.{format(date, 'M', { locale: deLocale })}
            </div>
          </ButtonBase>
        ))}
        <div className="arrow">
          <IconButton
            onClick={this.handleWeekForwardClick}
            aria-label="WeekForward"
            color="inherit"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </Fragment>
    );
  }
}

export default MensaNavigationWeek;
