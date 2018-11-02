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

import TestSearch from './TestSearch';

// import React from 'react';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ButtonAppBar extends Component {
  state = {
    open: false,
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
    // history.push('/search');
    this.setState({ open: true });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
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
            <Typography variant="h6" color="inherit" className={classes.flex}>
              ZHAWO
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
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            {/* <DialogTitle id="alert-dialog-slide-title">
              {'Stundenplan suchen:'}
            </DialogTitle> */}
            <DialogContent>
              {/* <DialogContentText id="alert-dialog-slide-description">
                Let Google help apps determine location. This means sending
                anonymous location data to Google, even when no apps are
                running.
              </DialogContentText> */}
              <TestSearch />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleClose} color="primary">
                Enter
              </Button>
            </DialogActions>
          </Dialog>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
