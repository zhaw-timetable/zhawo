import React, { Component } from 'react';

import * as globalActions from '../../../actions/GlobalActions';
import globalStore from '../../../stores/GlobalStore.js';

import history from '../../../history';

import CalendarSVG from '../../../assets/img//CalendarSVG/CalendarSVG';
import MenuSVG from '../../../assets/img/MenuSVG/MenuSVG';
import VsZHAWSVG from '../../../assets/img/VsZHAWSVG/VsZHAWSVG';
import ZHAWOSVG from '../../../assets/img/ZHAWOSVG/ZHAWOSVG';

class DrawerNav extends Component {
  state = {
    value: globalStore.viewState
  };

  updateViewState = value => {
    let selected;
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
    this.setState({ value });
    globalActions.setViewState(value);
  };

  render() {
    return (
      <div className="DrawerNav">
        <div
          className={
            'DrawerNavOption ' +
            (this.state.value === 0 ? 'DrawerNavOption-Selected' : ' ')
          }
          onClick={() => this.updateViewState(0)}
        >
          <CalendarSVG />
          <p>Stundenplan</p>
        </div>
        <div
          className={
            'DrawerNavOption ' +
            (this.state.value === 1 ? 'DrawerNavOption-Selected' : ' ')
          }
          onClick={() => this.updateViewState(1)}
        >
          <MenuSVG />
          <p>Mensa</p>
        </div>
        <div
          className={
            'DrawerNavOption ' +
            (this.state.value === 2 ? 'DrawerNavOption-Selected' : ' ')
          }
          onClick={() => this.updateViewState(2)}
        >
          <ZHAWOSVG />
          <p>Raumsuche</p>
        </div>
        <div
          className={
            'DrawerNavOption ' +
            (this.state.value === 3 ? 'DrawerNavOption-Selected' : ' ')
          }
          onClick={() => this.updateViewState(3)}
        >
          <VsZHAWSVG />
          <p>VSZHAW</p>
        </div>
      </div>
    );
  }
}

export default DrawerNav;
