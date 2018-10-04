// @flow

import React, { Component } from 'react';
import './Timebar.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = {};
type State = { hours: any };

class Timebar extends Component<Props, State> {
  state = {
    hours: [
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:50',
      '09:35',
      '09:35',
      '08:00',
      '08:45',
      '08:50',
      '09:35',
      '08:50',
      '09:35',
      '09:35'
    ]
  };

  render() {
    return (
      <div className="Timebar">
        {this.state.hours.map(h => (
          <div className="hour" id={h}>
            {h}
          </div>
        ))}
      </div>
    );
  }
}

export default Timebar;
