import React, { Component } from 'react';
import './ZHAWO.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

class ZHAWO extends Component {
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
