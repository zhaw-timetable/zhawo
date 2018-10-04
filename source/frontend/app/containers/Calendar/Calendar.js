// @flow

import React, { Component } from 'react';
import './Calendar.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = { month: any };
type State = { month: any };

class Calendar extends Component<Props, State> {
  state = { month: this.props.month };

  render() {
    return (
      <div className="Calendar">
        <div className="days">
          <div className="day">M</div>
          <div className="day">T</div>
          <div className="day">W</div>
          <div className="day">T</div>
          <div className="day">F</div>
          <div className="day">S</div>
        </div>
        <div className="dates">
          <div className="week">
            <div className="date">1</div>
            <div className="date">2</div>
            <div className="date active">3</div>
            <div className="date">4</div>
            <div className="date">5</div>
            <div className="date">6</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
