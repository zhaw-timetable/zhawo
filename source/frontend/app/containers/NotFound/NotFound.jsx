import React, { Component } from 'react';
import './NotFound.sass';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore';

class NotFound extends Component {
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
