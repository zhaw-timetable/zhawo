import React, { Component } from 'react';
import './DrawerContainer.sass';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore.js';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import Drawer from '@material-ui/core/Drawer';

class DrawerContainer extends Component {
  state = { drawerOpen: globalStore.drawerOpen };

  componentWillMount() {
    globalStore.on('drawerOpen_changed', this.handleDrawer);
  }

  componentWillUnmount() {
    globalStore.removeListener('drawerOpen_changed', this.handleDrawer);
  }

  toggleDrawer = value => {
    globalActions.toggleDrawer();
  };

  handleDrawer = () => {
    this.setState({ drawerOpen: globalStore.drawerOpen });
  };

  render() {
    return (
      <Drawer
        anchor="left"
        open={this.state.drawerOpen}
        onClose={this.toggleDrawer}
      >
        <div className="DrawerContainer" tabIndex={0} role="button">
          Hi
        </div>
      </Drawer>
    );
  }
}

export default DrawerContainer;
