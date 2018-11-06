import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import TodayIcon from '@material-ui/icons/Today';

import './AppBarContainer.sass';

import * as scheduleActions from '../../actions/ScheduleActions';

import ScheduleSearch from './components/ScheduleSearch/ScheduleSearch';

import Dialog from '@material-ui/core/Dialog';

import Slide from '@material-ui/core/Slide';
import scheduleStore from '../../stores/ScheduleStore';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class AppBarContainer extends Component {
  state = {
    open: false,
    showInput: false,
    currentSearch: scheduleStore.currentSearch
  };

  componentWillMount() {
    scheduleStore.on('schedule_changed', this.refreshState);
  }

  componentWillUnmount() {
    scheduleStore.removeListener('schedule_changed', this.refreshState);
  }

  refreshState = () => {
    this.setState({
      currentSearch: scheduleStore.currentSearch
    });
  };

  handleGoToTodayClick = e => {
    e.preventDefault();
    const currentDate = new Date();
    scheduleActions.gotoDay(currentDate);
  };

  toggleShowInput = () => {
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

  handleClearSearch = e => {
    scheduleActions.clearSearch();
  };

  render() {
    return (
      <div className="AppBarContainer">
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton
              className="menuButton"
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className="flex">
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
            {!this.state.currentSearch && (
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.toggleShowInput}
                color="inherit"
              >
                <SearchIcon />
              </IconButton>
            )}
            {this.state.currentSearch && (
              <Button
                onClick={this.handleClearSearch}
                color="default"
                variant="text"
                fontSize="small"
                className="SearchClearButton"
              >
                {scheduleStore.currentSearch}
                <ClearIcon id="SearchClearIcon" />
              </Button>
            )}
          </Toolbar>
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <ScheduleSearch handleClose={this.handleClose} />
          </Dialog>
        </AppBar>
      </div>
    );
  }
}

export default AppBarContainer;
