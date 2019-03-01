import React, { Component, Fragment } from 'react';

import './MensaContainer.sass';

import mensaStore from '../../stores/MensaStore';
import * as mensaActions from '../../actions/MensaActions';

import AppBarContainer from '../AppBarContainer/AppBarContainer';
import MensaContextMenu from './components/MensaContextMenu/MensaContextMenu';

class MensaContainer extends Component {
  state = {
    currentMenuDay: null,
    currentDate: mensaStore.currentDate
  };

  componentWillMount() {
    mensaStore.on('menuplan_changed', this.handleMenuPlanChanged);
  }

  componentWillUnmount() {
    mensaStore.removeListener('menuplan_changed', this.handleMenuPlanChanged);
  }

  componentDidUpdate() {
    console.log('Menuplan changed');
    console.log('Current menuplan:', this.state.currentMenuDay);
  }

  handleMenuPlanChanged = () => {
    this.setState({ currentMenuDay: mensaStore.currentMenuDay });
  };

  render() {
    return (
      <Fragment>
        <AppBarContainer>
          <MensaContextMenu />
        </AppBarContainer>
        <div className="MensaContainer">
          {this.state.currentMenuDay &&
            this.state.currentMenuDay.dishes.map(dish => {
              return (
                <div className="DishContainer" key={dish.id}>
                  {dish.name} {dish.internalPrice} CHF
                </div>
              );
            })}
        </div>
      </Fragment>
    );
  }
}

export default MensaContainer;
