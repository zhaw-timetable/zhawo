import React, { Component } from 'react';

import './AppBarContainer.sass';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import * as scheduleActions from '../../actions/ScheduleActions';
import scheduleStore from '../../stores/ScheduleStore';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore.js';

import ScheduleSearch from './components/ScheduleSearch/ScheduleSearch';

class AppBarContainer extends Component {
  render() {
    return (
      <div className="AppBarContainer">
        <AppBar position="static" color="inherit">
          <Toolbar>
            <IconButton
              className="menuButton"
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className="flex">
              ZHAWO
            </Typography>
            <ScheduleSearch />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default AppBarContainer;
