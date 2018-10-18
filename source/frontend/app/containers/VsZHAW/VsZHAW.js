// @flow

import React, { Component } from 'react';

import './VsZHAW.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

type Props = {};
type State = {};

class VsZHAW extends Component<Props, State> {
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
