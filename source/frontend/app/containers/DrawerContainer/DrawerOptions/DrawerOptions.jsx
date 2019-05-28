import React, { Component } from 'react';

import * as globalActions from '../../../actions/GlobalActions';
import globalStore from '../../../stores/GlobalStore.js';

import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

/**
 * Drawer Option Component
 *
 * Contains to option switches.
 * Day/Week view. Dark/Light Mode.
 * Contains Logout Button.
 *
 * @class DrawerOptions
 * @extends {Component}
 */
class DrawerOptions extends Component {
  state = {
    themeSwitch: globalStore.theme == 'darkTheme',
    viewSwitch: globalStore.isDayView
  };

  componentWillMount() {
    globalStore.on('isDayView_changed', this.handleViewChanged);
    globalStore.on('theme_changed', this.handleThemeChanged);
  }

  componentWillUnmount() {
    globalStore.removeListener('isDayView_changed', this.handleViewChanged);
    globalStore.removeListener('theme_changed', this.handleThemeChanged);
  }

  /**
   * Function that call Action logout user.
   *
   * @memberof DrawerOptions
   */
  logout = () => {
    globalActions.logout();
  };

  /**
   * Function that is called on when Theme Switch changes.
   * Calls action to set state in Global Store.
   *
   * @memberof DrawerOptions
   */
  handleThemeSwitchChange = event => {
    globalActions.changeTheme(event.target.checked);
  };

  /**
   * Function that is called when store changes.
   * Sets local themeSwitch state to match store theme state.
   *
   * @memberof DrawerOptions
   */
  handleThemeChanged = () => {
    this.setState({ themeSwitch: globalStore.theme == 'darkTheme' });
  };

  /**
   * Function that is called when store changes.
   * Sets local viewSwitch state to match store isDayView state.
   *
   * @memberof DrawerOptions
   */
  handleViewChanged = () => {
    this.setState({ viewSwitch: globalStore.isDayView });
  };

  /**
   * Function that is called on when Day/Week view Switch changes.
   * Calls action to set state in global Store.
   *
   * @memberof DrawerOptions
   */
  handleViewSwitchChange = event => {
    globalActions.setDayView(event.target.checked);
  };

  render() {
    return (
      <div className="DrawerOptions">
        <div className="switchContainers">
          <div className="switchContainer">
            {' '}
            <Switch
              checked={this.state.themeSwitch}
              onChange={this.handleThemeSwitchChange}
              value="themeSwitch"
              classes={{
                checked: 'colorChecked',
                bar: this.state.themeSwitch && 'colorBar'
              }}
            />
            {!this.state.themeSwitch && 'Dark Mode'}
            {this.state.themeSwitch && 'Light Mode'}
          </div>

          <div className="switchContainer">
            {' '}
            <Switch
              checked={this.state.viewSwitch}
              onChange={this.handleViewSwitchChange}
              value="themeSwitch"
              classes={{
                checked: 'colorChecked',
                bar: this.state.viewSwitch && 'colorBar'
              }}
            />
            {!this.state.viewSwitch && 'Day View'}
            {this.state.viewSwitch && 'Week View'}
          </div>
        </div>
        <Button className="LogoutBtn" onClick={this.logout} color="inherit">
          Logout
        </Button>
      </div>
    );
  }
}

export default DrawerOptions;
