import React, { Component } from 'react';
import './DrawerContainer.sass';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore.js';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import Drawer from '@material-ui/core/Drawer';

class DrawerContainer extends Component {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <Drawer anchor="top" open={this.props.open} onClose={this.props.onClose}>
        <div className="DrawerContainer" tabIndex={0} role="button">
          Hi
        </div>
      </Drawer>
    );
  }
}

export default DrawerContainer;
