import React, { Component, Fragment } from 'react';

import './MenuPlan.sass';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

/**
 * Menu Plan Component.
 * List of the Meals for Selected Mensa on selected day.
 *
 * @class MenuPlan
 * @extends {Component}
 */
class MenuPlan extends Component {
  state = {
    currentMenuDay: mensaStore.currentMenuDay,
    emptyMenuMessage: mensaStore.emptyMenuMessage,
    selectedMensaName: mensaStore.selectedMensaName
  };

  componentWillMount() {
    mensaStore.on('menuplan_changed', this.handleMenuPlanChanged);
  }

  componentWillUnmount() {
    mensaStore.removeListener('menuplan_changed', this.handleMenuPlanChanged);
  }

  /**
   * Function called when store changes.
   * Sets local currentMenuDay, emptyMenuMessage and selectedMensaName state to match store.
   *
   * @memberof MenuPlan
   */
  handleMenuPlanChanged = () => {
    this.setState({
      currentMenuDay: mensaStore.currentMenuDay,
      emptyMenuMessage: mensaStore.emptyMenuMessage,
      selectedMensaName: mensaStore.selectedMensaName
    });
  };

  render() {
    const { currentMenuDay, emptyMenuMessage, selectedMensaName } = this.state;
    return (
      <div className="MenuPlan">
        <div className="MenuPlanHeader">{selectedMensaName}</div>
        {currentMenuDay &&
          currentMenuDay.dishes.map(dish => {
            return (
              <div className="DishContainer" key={dish.id}>
                <div className="DishLabel">{dish.label}</div>
                <div className="DishDetail">
                  <div className="DishTitle">{dish.name}</div>
                  <div className="DishDescription">
                    {dish.sideDishes &&
                      dish.sideDishes[0] &&
                      dish.sideDishes[0].name}
                  </div>
                </div>
                <div className="DishPriceInfo">
                  <div className="DishPrice">
                    {Number(dish.internalPrice).toFixed(2)}
                  </div>{' '}
                  <div className="DishCurrency">CHF</div>
                </div>
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
