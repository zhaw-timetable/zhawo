import React, { Component } from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import CalendarSVG from '../../assets/img//CalendarSVG/CalendarSVG';
import MenuSVG from '../../assets/img/MenuSVG/MenuSVG';
import VsZHAWSVG from '../../assets/img/VsZHAWSVG/VsZHAWSVG';
import ZHAWOSVG from '../../assets/img/ZHAWOSVG/ZHAWOSVG';

import './BottomNavContainer.sass';

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
        history.push('/mensa');
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
        <BottomNavigationAction
          classes={{
            root: 'BottomNavigationAction',
            selected: 'BottomNavigationAction-selected'
          }}
          label="Stundenplan"
          icon={<CalendarSVG />}
        />
        <BottomNavigationAction
          classes={{
            root: 'BottomNavigationAction',
            selected: 'BottomNavigationAction-selected'
          }}
          label="Mensa"
          icon={<MenuSVG />}
        />
        <BottomNavigationAction
          classes={{
            root: 'BottomNavigationAction',
            selected: 'BottomNavigationAction-selected'
          }}
          label="Raumsuche"
          icon={<ZHAWOSVG />}
        />
        <BottomNavigationAction
          classes={{
            root: 'BottomNavigationAction',
            selected: 'BottomNavigationAction-selected'
          }}
          label="VsZHAW"
          icon={<VsZHAWSVG />}
        />
      </BottomNavigation>
    );
  }
}

export default BottomNavContainer;
