import React, { Component, Fragment } from 'react';
import './MensaContextMenu.sass';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

import IconButton from '@material-ui/core/IconButton';
import TodayIcon from '@material-ui/icons/Today';
import MensaIcon from '@material-ui/icons/Fastfood';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

class MensaContextMenu extends Component {
  state = {
    allMensas: [],
    selectedMensaName: mensaStore.selectedMensaName,
    currentDate: mensaStore.currentDate,
    anchorEl: null
  };

  componentDidMount() {
    const { currentDate } = this.state;
    mensaActions.getAllMensas();
    mensaActions.getMenuPlan(1, 'Technikum', currentDate);
  }

  componentWillMount() {
    mensaStore.on('mensas_loaded', this.handleMensasLoaded);
  }

  componentWillUnmount() {
    mensaStore.removeListener('mensas_loaded', this.handleMensasLoaded);
  }

  handleClick = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMensasLoaded = () => {
    this.setState({
      allMensas: mensaStore.allMensas,
      selectedMensaName: mensaStore.selectedMensaName
    });
  };

  getMenuPlan = params => e => {
    const { currentDate } = this.state;
    const { id, name } = params;
    e.preventDefault();
    mensaActions.getMenuPlan(id, name, currentDate);
    this.setState({ selectedMensaName: name, anchorEl: null });
  };

  handleGoToTodayClick = e => {
    e.preventDefault();
    const currentDate = new Date();
    mensaActions.gotoDay(currentDate);
  };

  render() {
    const { anchorEl, selectedMensaName } = this.state;
    return (
      <Fragment>
        <IconButton
          aria-owns={this.state.isScheduleSearchOpen ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleGoToTodayClick}
          color="inherit"
        >
          <TodayIcon />
        </IconButton>
        <IconButton
          aria-owns={this.state.isScheduleSearchOpen ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          color="inherit"
        >
          <MensaIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.state.allMensas.map(mensa => {
            return (
              <MenuItem
                key={mensa.id}
                onClick={this.getMenuPlan({ id: mensa.id, name: mensa.name })}
              >
                {mensa.name}
              </MenuItem>
            );
          })}
        </Menu>
      </Fragment>
    );
  }
}

export default MensaContextMenu;
