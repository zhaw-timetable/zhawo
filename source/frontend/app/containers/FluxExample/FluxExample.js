// @flow

import React, { Component } from 'react';
import './FluxExample.sass';
import * as Actions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore';

type Props = {};
type State = { name: any };

class FluxExample extends Component<Props, State> {
  state = {
    name: globalStore.getName()
  };

  // Bind change listener
  componentWillMount() {
    globalStore.on('name_changed', this.refreshName);
  }

  // Unbind change listener
  componentWillUnmount() {
    globalStore.removeListener('name_changed', this.refreshName);
  }

  refreshName = () => {
    this.setState({
      name: globalStore.getName()
    });
  };

  handleChangeTextField = (e: SyntheticInputEvent<HTMLInputElement>) => {
    globalActions.setName(e.target.value);
  };

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
