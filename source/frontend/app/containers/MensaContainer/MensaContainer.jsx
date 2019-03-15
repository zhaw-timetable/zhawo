import React, { Component, Fragment } from 'react';

import './MensaContainer.sass';

import Swipe from 'react-easy-swipe';

import mensaStore from '../../stores/MensaStore';
import * as mensaActions from '../../actions/MensaActions';

import AppBarContainer from '../AppBarContainer/AppBarContainer';
import MensaContextMenu from './components/MensaContextMenu/MensaContextMenu';
import MensaNavigationWeek from './components/MensaNavigationWeek/MensaNavigationWeek';
import MenuPlan from './components/MenuPlan/MenuPlan';

class MensaContainer extends Component {
  state = {
    swipeInX: 0
  };

  onSwipeStart = event => {
    this.setState({ swipeInX: 0 });
  };

  onSwipeMove = (position, event) => {
    this.setState({ swipeInX: position.x });
  };

  onSwipeEnd = event => {
    let { swipeInX } = this.state;
    if (swipeInX > window.innerWidth / 4) {
      mensaActions.swipeLeft();
    } else if (swipeInX < -window.innerWidth / 4) {
      mensaActions.swipeRight();
    }
  };

  render() {
    return (
      <Fragment>
        <AppBarContainer>
          <MensaContextMenu />
        </AppBarContainer>
        <Swipe
          onSwipeMove={this.onSwipeMove}
          onSwipeEnd={this.onSwipeEnd}
          onSwipeStart={this.onSwipeStart}
        >
          <div className="MensaContainer">
            <MensaNavigationWeek />
            <div className="MensaContent">
              <MenuPlan />
            </div>
          </div>
        </Swipe>
      </Fragment>
    );
  }
}

export default MensaContainer;
