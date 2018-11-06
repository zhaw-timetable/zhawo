import React, { Component } from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import history from '../../history';

class BottomNavContainer extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
    switch (value) {
      case 0:
        history.push('/');
        break;
      case 1:
        history.push('/menu');
        break;
      case 2:
        history.push('/zhawo');
        break;
      case 3:
        history.push('/vszhaw');
        break;
    }
  };

  render() {
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className="BottomNavContainer"
      >
        <BottomNavigationAction label="Stundenplan" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Mensa" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Raumsuche" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="VsZHAW" icon={<LocationOnIcon />} />
      </BottomNavigation>
    );
  }
}

export default BottomNavContainer;
