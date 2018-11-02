import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import TodayIcon from '@material-ui/icons/Today';
import AccountCircle from '@material-ui/icons/AccountCircle';

import history from '../../history';

import * as scheduleActions from '../../actions/ScheduleActions';

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class ButtonAppBar extends Component {
  state = {
    showInput: false
  };

  handleGoToTodayClick = e => {
    e.preventDefault();
    const currentDate = new Date();
    scheduleActions.gotoDay(currentDate);
  };

  toggleShowInput = () => {
    // this.setState({
    //   showInput: !this.state.showInput
    // });
    history.push('/search');
  };

  handleKeyPress = e => {
    const { value } = e.target;
    const { key } = e;
    if (key === 'Enter') {
      const currentDate = new Date();
      this.toggleShowInput();
      scheduleActions.getSchedule('students', value, currentDate);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              zhawo
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
            <IconButton
              aria-owns={open ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={this.handleGoToTodayClick}
              color="inherit"
            >
              <TodayIcon />
            </IconButton>
            <IconButton
              aria-owns={open ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={this.toggleShowInput}
              color="inherit"
            >
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
