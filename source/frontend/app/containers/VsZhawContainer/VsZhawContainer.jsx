import React, { Component, Fragment } from 'react';

import * as vszhawActions from '../../actions/VsZhawActions';
import vszhawStore from '../../stores/VsZhawStore';

import './VsZhawContainer.sass';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

class VsZhawContainer extends Component {
  componentDidMount() {
    vszhawActions.getVszhawFeed();
  }

  render() {
    return (
      <Fragment>
        <AppBarContainer />
        <div className="VsZhawContainer">
          <h1>VsZhawContainer - work in progress</h1>
        </div>
      </Fragment>
    );
  }
}

export default VsZhawContainer;
