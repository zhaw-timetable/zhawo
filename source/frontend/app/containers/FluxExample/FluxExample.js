import React, { Component } from 'react';

// For flux
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

class FluxExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: Store.getName()
    };

    this.refreshName = this.refreshName.bind(this);
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
  }

  // Bind change listener
  componentWillMount() {
    Store.on('name_changed', this.refreshName);
  }

  // Unbind change listener
  componentWillUnmount() {
    Store.removeListener('name_changed', this.refreshName);
  }

  refreshName() {
    this.setState({
      name: Store.getName()
    });
  }

  handleChangeTextField(event) {
    Actions.setName(event.target.value);
  }
  render() {
    return (
      <div>
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
