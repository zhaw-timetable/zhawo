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

  render() {
    return (
      <div>
        <h1 className="FluxExampleTitle">{this.state.name}</h1>
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
