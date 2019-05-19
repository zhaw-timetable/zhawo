import React, { Component, Fragment } from 'react';
import './MensaContextMenu.sass';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

import IconButton from '@material-ui/core/IconButton';
import TodayIcon from '@material-ui/icons/Today';
import MensaIcon from '@material-ui/icons/Fastfood';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

/**
 * Mensa Context Menu Component
 * Contains the Mensa Elements that need to be passed to AppBar
 * Go to today button
 * Select Mensa button
 *
 * @class MensaContextMenu
 * @extends {Component}
 */
class MensaContextMenu extends Component {
  state = {
    allMensas: [],
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

  /**
   * Function called when store changes.
   * List of Mensas is readay and list can be stored in local state.
   * Local selectedMensaName state is set.
   *
   * @memberof MensaContextMenu
   */
  handleMensasLoaded = () => {
    this.setState({
      allMensas: mensaStore.allMensas,
      selectedMensaName: mensaStore.selectedMensaName
    });
  };

  /**
   * Function that sets local anchorEl state to selected value
   *
   * @memberof MensaContextMenu
   */
  handleClick = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  /**
   * Function that sets local anchorEl state back to null
   *
   * @memberof MensaContextMenu
   */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /**
   * Params Object
   * @typedef {Object} Params
   * @property {string} id
   * @property {string} name
   */

  /**
   * Function that prevents the default behavior of an element, gets Menu plan for the selected Mensa using getMenuPlan action and sets local selectedMensaName state to the selected mensa and the anchorEl state to null.
   * @param {Params} params
   * @memberof MensaContextMenu
   */
  getMenuPlan = params => e => {
    const { currentDate } = this.state;
    const { id, name } = params;
    e.preventDefault();
    mensaActions.getMenuPlan(id, name, currentDate);
    this.setState({ selectedMensaName: name, anchorEl: null });
  };

  /**
   * Function that prevents the default behavior of an element and uses the gotoDay action to go to current day.
   *
   * @memberof MensaContextMenu
   */
  handleGoToTodayClick = e => {
    e.preventDefault();
    const currentDate = new Date();
    mensaActions.gotoDay(currentDate);
  };

  render() {
    const { anchorEl, allMensas } = this.state;
    return (
      <Fragment>
        <IconButton
          aria-haspopup="true"
          onClick={this.handleGoToTodayClick}
          color="inherit"
        >
          <TodayIcon />
        </IconButton>
        <IconButton
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
          {allMensas.map(mensa => {
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
