// @flow

import React, { Component } from 'react';
import './ZHAWO.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

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
