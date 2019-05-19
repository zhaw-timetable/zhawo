import React, { Component, Fragment } from 'react';
import './DrawerContainer.sass';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore.js';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import LogoSVG from '../../assets/img/LogoSVG/LogoSVG';

import DrawerOptions from './DrawerOptions/DrawerOptions';
import DrawerNav from './DrawerNav/DrawerNav';

/**
 * Drawer Component.
 *
 * Floats to the right.
 * Is hidden on Mobile and fixed on lager Screens.
 *
 * @class DrawerContainer
 * @extends {Component}
 */
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

  /**
   * Function that calls action to open/close drawer state
   *
   * @memberof DrawerContainer
   */
  toggleDrawer = () => {
    globalActions.toggleDrawer();
  };

  /**
   * Function that is called when store changes.
   * Sets local drawerOpen state to match store drawerOpen state.
   * @memberof DrawerContainer
   */
  handleDrawer = () => {
    this.setState({ drawerOpen: globalStore.drawerOpen });
  };

  render() {
    return (
      <Fragment>
        <Hidden mdUp>
          <Drawer
            classes={{
              modal: 'Drawer'
            }}
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
                  <h1>Hoi {globalStore.currentUser}</h1>
                  <p>Willkommen bei ZhaWo </p>
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
          <Drawer
            variant="permanent"
            open
            classes={{
              docked: 'Drawer ' + this.props.className,
              paperAnchorDockedLeft: 'Drawer-docked'
            }}
          >
            <AppBarContainer>
              <LogoSVG />
            </AppBarContainer>

            <div className="DrawerContainer ">
              <div className="TextContainer">
                <h1>Hoi {globalStore.currentUser}</h1>
                <p>Willkommen bei ZhaWo </p>
              </div>
              <DrawerNav />
              <DrawerOptions />
            </div>
          </Drawer>
        </Hidden>
      </Fragment>
    );
  }
}

export default DrawerContainer;
