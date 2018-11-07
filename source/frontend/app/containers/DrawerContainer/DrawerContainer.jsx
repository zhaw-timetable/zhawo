import React, { Component } from 'react';
import './DrawerContainer.sass';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore.js';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class DrawerContainer extends Component {
  state = {
    drawerOpen: globalStore.drawerOpen,
    themeSwitch: globalStore.theme == 'darkTheme'
  };

  componentWillMount() {
    globalStore.on('drawerOpen_changed', this.handleDrawer);
    globalStore.on('theme_changed', this.handleThemeChanged);
  }

  componentWillUnmount() {
    globalStore.removeListener('drawerOpen_changed', this.handleDrawer);
    globalStore.removeListener('theme_changed', this.handleThemeChanged);
  }

  toggleDrawer = value => {
    globalActions.toggleDrawer();
  };

  handleDrawer = () => {
    this.setState({ drawerOpen: globalStore.drawerOpen });
  };

  logout = () => {
    globalActions.logout();
  };

  handleSwitchChange = () => event => {
    console.log('changing theme', event.target.checked);
    globalActions.changeTheme(event.target.checked);
  };

  handleThemeChanged = () => {
    console.log(globalStore.theme == 'darkTheme');
    this.setState({ themeSwitch: globalStore.theme == 'darkTheme' });
  };

  render() {
    return (
      <Drawer
        anchor="left"
        open={this.state.drawerOpen}
        onClose={this.toggleDrawer}
      >
        <div
          className={'DrawerContainer ' + this.props.className}
          tabIndex={0}
          role="button"
        >
          Hi
          <Button onClick={this.logout}>Logout</Button>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.themeSwitch}
                onChange={this.handleSwitchChange()}
                value="themeSwitch"
              />
            }
            label="Dark Mode"
          />
        </div>
      </Drawer>
    );
  }
}

export default DrawerContainer;
