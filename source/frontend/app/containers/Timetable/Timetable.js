// @flow

import React, { Component } from 'react';
import './Timetable.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

import Timebar from '../Timebar/Timebar.js';
import Calendar from '../Calendar/Calendar.js';

type Props = {};
type State = { month: any };

class Timetable extends Component<Props, State> {
  state = {
    month: Store.getName()
  };

  // Bind change listener
  componentWillMount() {
    Store.on('name_changed', this.refreshName);
  }

  // Unbind change listener
  componentWillUnmount() {
    Store.removeListener('name_changed', this.refreshName);
  }

  refreshName = () => {
    this.setState({
      month: Store.getName()
    });
  };

  render() {
    return (
      <div className="Timetable">
        <Calendar month={this.state.month} />
        <div className="content">
          <Timebar />
        </div>
      </div>
    );
  }
}

export default Timetable;
