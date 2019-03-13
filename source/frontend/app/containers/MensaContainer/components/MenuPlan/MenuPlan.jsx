import React, { Component, Fragment } from 'react';

import './MenuPlan.sass';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

class MenuPlan extends Component {
  state = {
    currentMenuDay: mensaStore.currentMenuDay,
    emptyMenuMessage: mensaStore.emptyMenuMessage
  };

  componentWillMount() {
    mensaStore.on('menuplan_changed', this.handleMenuPlanChanged);
  }

  componentWillUnmount() {
    mensaStore.removeListener('menuplan_changed', this.handleMenuPlanChanged);
  }

  handleMenuPlanChanged = () => {
    this.setState({
      currentMenuDay: mensaStore.currentMenuDay,
      emptyMenuMessage: mensaStore.emptyMenuMessage
    });
  };

  render() {
    const { currentMenuDay, emptyMenuMessage } = this.state;
    return (
      <div className="MenuPlan">
        {currentMenuDay &&
          currentMenuDay.dishes.map(dish => {
            return (
              <div className="DishContainer" key={dish.id}>
                {dish.name} {dish.internalPrice} CHF
              </div>
            );
          })}
        {emptyMenuMessage && (
          <div className="EmptyMenuMessage">{emptyMenuMessage}</div>
        )}
      </div>
    );
  }
}

export default MenuPlan;
