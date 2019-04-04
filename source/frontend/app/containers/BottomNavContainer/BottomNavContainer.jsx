import React, { Component } from 'react';

import './BottomNavContainer.sass';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import CalendarSVG from '../../assets/img//CalendarSVG/CalendarSVG';
import MenuSVG from '../../assets/img/MenuSVG/MenuSVG';
import VsZHAWSVG from '../../assets/img/VsZHAWSVG/VsZHAWSVG';
import ZHAWOSVG from '../../assets/img/ZHAWOSVG/ZHAWOSVG';

import history from '../../history';
import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

class BottomNavContainer extends Component {
  state = {
    value: globalStore.viewState
  };

  updateViewState = (event, value) => {
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
    globalActions.setViewState(value);
  };

  render() {
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.updateViewState}
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
