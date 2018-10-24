import React, { Component } from 'react';

import './VsZHAW.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

class VsZHAW extends Component {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="VsZHAW">
        <h1>VsZHAW</h1>
      </div>
    );
  }
}

export default VsZHAW;
