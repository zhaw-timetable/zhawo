import React, { Component, Fragment } from 'react';

import './MensaContainer.sass';

import Swipe from 'react-easy-swipe';

import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

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
          <Hidden mdUp>
            <Typography variant="h6" color="inherit" className="flex">
              ZHAWo
            </Typography>
          </Hidden>
          <MensaContextMenu />
        </AppBarContainer>
        <Swipe
          onSwipeMove={this.onSwipeMove}
          onSwipeEnd={this.onSwipeEnd}
          onSwipeStart={this.onSwipeStart}
          className="ContentWrapper"
        >
          <div className="MensaContainer">
            <div className="NavigationContainer">
              <MensaNavigationWeek />
            </div>
            <div className="MenusContainer">
              <MenuPlan />
            </div>
          </div>
        </Swipe>
      </Fragment>
    );
  }
}

export default MensaContainer;
