import React, { Component, Fragment } from 'react';
import './MensaContextMenu.sass';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
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
    mensaActions.getAllMensas();
    mensaActions.getMenuPlan(1, 'Technikum', this.state.currentDate);
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
    e.preventDefault();
    mensaActions.getMenuPlan(params.id, params.name, this.state.currentDate);
    this.setState({ selectedMensaName: params.name, anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    return (
      <Fragment>
        <Button onClick={this.handleClick}>
          {this.state.selectedMensaName}
        </Button>
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
