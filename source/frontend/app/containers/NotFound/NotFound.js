// @flow

import React, { Component } from 'react';
import './NotFound.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = {};
type State = {};

class NotFound extends Component<Props, State> {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="NotFound">
        <h1>404</h1>
        <h2>Not found</h2>
      </div>
    );
  }
}

export default NotFound;
