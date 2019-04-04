import React, { Component } from 'react';

import * as globalActions from '../../../actions/GlobalActions';
import globalStore from '../../../stores/GlobalStore.js';

import history from '../../../history';

class DrawerNav extends Component {
  state = {
    value: globalStore.viewState
  };

  updateViewState = value => {
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
    return (
      <div className="DrawerNav">
        <div className="DrawerNavOption" onClick={this.updateViewState(1)}>
          mensa
        </div>
      </div>
    );
  }
}

export default DrawerNav;
