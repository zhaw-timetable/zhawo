// @flow

import React, { Component } from 'react';
import './ZHAWO.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

type Props = {};
type State = {};

class ZHAWO extends Component<Props, State> {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="ZHAWO">
        <h1>ZHAWO</h1>
      </div>
    );
  }
}

export default ZHAWO;
