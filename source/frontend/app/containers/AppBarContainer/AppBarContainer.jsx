import React, { Component } from 'react';

import './AppBarContainer.sass';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';

import * as globalActions from '../../actions/GlobalActions';

/**
 * AppBar Component. Styled in Material design.
 * Can be passed children that will desplayed in bar.
 *
 * @class AppBarContainer
 * @extends {Component}
 */
class AppBarContainer extends Component {
  /** State of Drawer */
  toggleDrawer = () => {
    globalActions.toggleDrawer();
  };

  render() {
    const { children } = this.props;
    return (
      <div className="AppBarContainer">
        <AppBar position="static" color="inherit">
          <Toolbar
            classes={{
              root: 'AppBarToolbar'
            }}
          >
            <Hidden mdUp>
              <IconButton
                className="menuButton"
                color="inherit"
                aria-label="Menu"
                onClick={this.toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            {children}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default AppBarContainer;
