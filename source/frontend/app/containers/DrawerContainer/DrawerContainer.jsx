import React, { Component, Fragment } from 'react';
import './DrawerContainer.sass';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore.js';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import LogoSVG from '../../assets/img/LogoSVG/LogoSVG';

import DrawerOptions from './DrawerOptions/DrawerOptions';

class DrawerContainer extends Component {
  state = {
    drawerOpen: globalStore.drawerOpen,
    themeSwitch: globalStore.theme == 'darkTheme',
    viewSwitch: globalStore.isDayView
  };

  componentWillMount() {
    globalStore.on('drawerOpen_changed', this.handleDrawer);
  }

  componentWillUnmount() {
    globalStore.removeListener('drawerOpen_changed', this.handleDrawer);
  }

  toggleDrawer = () => {
    globalActions.toggleDrawer();
  };

  handleDrawer = () => {
    this.setState({ drawerOpen: globalStore.drawerOpen });
  };

  render() {
    return (
      <Fragment>
        <Hidden mdUp>
          <Drawer
            anchor="left"
            variant="temporary"
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
              <DrawerOptions />
            </div>
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer variant="permanent" open>
            <div
              className={'DrawerContainer ' + this.props.className}
              tabIndex={0}
              role="button"
            >
              <DrawerOptions />
            </div>
          </Drawer>
        </Hidden>
      </Fragment>
    );
  }
}

export default DrawerContainer;
