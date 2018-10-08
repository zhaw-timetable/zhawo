// @flow

import React, { Component } from 'react';
import './FluxExample.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = {};
type State = { name: any };

class FluxExample extends Component<Props, State> {
  state = {
    name: Store.getName()
  };

  // Bind change listener
  componentWillMount() {
    Store.on('name_changed', this.refreshName);
    this.updateTimetable();
  }

  // Unbind change listener
  componentWillUnmount() {
    Store.removeListener('name_changed', this.refreshName);
  }

  refreshName = () => {
    this.setState({
      name: Store.getName()
    });
  };

  handleChangeTextField = (e: SyntheticInputEvent<HTMLInputElement>) => {
    Actions.setName(e.target.value);
  };

  async updateTimetable() {
    const stream = await fetch('http://localhost:4000/api/timetable/students', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: 'bachmdo2',
        startDate: '27-09-2018'
      })
    });
    const response = await stream.json();
    console.log(response.days);
  }

  render() {
    return (
      <div className="FluxExample">
        <h1>{this.state.name}</h1>
        <input
          type="text"
          value={this.state.name}
          onChange={this.handleChangeTextField}
        />
      </div>
    );
  }
}

export default FluxExample;
