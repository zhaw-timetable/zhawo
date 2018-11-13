import React, { Component } from 'react';

import './AppBarContainer.sass';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import * as globalActions from '../../actions/GlobalActions';

class AppBarContainer extends Component {
  toggleDrawer = value => {
    globalActions.toggleDrawer();
  };

  render() {
    const { children } = this.props;
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
            {children}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default AppBarContainer;
