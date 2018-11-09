import React, { Component } from 'react';
import './DrawerContainer.sass';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore.js';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import LogoSVG from '../../assets/img/LogoSVG/LogoSVG';

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

  toggleDrawer = () => {
    globalActions.toggleDrawer();
  };

  handleDrawer = () => {
    this.setState({ drawerOpen: globalStore.drawerOpen });
  };

  logout = () => {
    globalActions.logout();
  };

  handleSwitchChange = event => {
    globalActions.changeTheme(event.target.checked);
  };

  handleThemeChanged = () => {
    if (globalStore.drawerOpen) {
      this.setState({ themeSwitch: globalStore.theme == 'darkTheme' });
    }
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
          <div className="InfoContainer">
            <div className="LogoContainer">
              <LogoSVG />
            </div>
            <div className="TextContainer">
              <h1>Hello {globalStore.currentUser}</h1>
              <p>Welcome to ZhaWo </p>
            </div>
            <IconButton
              className="closeButton"
              color="inherit"
              aria-label="Close"
              onClick={this.toggleDrawer}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <Divider />
          <Switch
            checked={this.state.themeSwitch}
            onChange={this.handleSwitchChange}
            value="themeSwitch"
          />
          {!this.state.themeSwitch && 'Dark Mode'}
          {this.state.themeSwitch && 'Light Mode'}
          <Button className="LogoutBtn" onClick={this.logout} color="inherit">
            Logout
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default DrawerContainer;