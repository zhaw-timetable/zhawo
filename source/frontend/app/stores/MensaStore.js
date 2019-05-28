import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import { startOfWeek, addDays, getDay, isSameDay } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

/**
 * Flux Store MensaStore
 */
class MensaStore extends EventEmitter {
  constructor() {
    super();
    this.allMensas = [];
    this.selectedMensaId = '';
    this.selectedMensaName = '';
    this.currentMenuPlan = null;
    this.currentMenuDay = null;
    this.currentDate = new Date();
    this.displayDay = this.currentDate;
    this.displayStartOfWeek = startOfWeek(this.displayDay);
    this.displayWeek = this.createDisplayWeek(this.displayDay);
    this.emptyMenuMessage = '';
  }

  /**
   * A flux action with a type and optional payload
   * @typedef {Object} FluxAction
   * @property {string} type
   * @property {Object} [payload]
   */
  /**
   * Function that is called after action is dispatched
   * Uses switch to filter actions
   * @param {FluxAction} action
   */
  async handleActions(action) {
    try {
      switch (action.type) {
        case 'GET_ALL_MENSAS':
          this.allMensas = await api.getAllMensas();
          this.emit('mensas_loaded');
          break;

        case 'GET_MENUPLAN':
          this.selectedMensaId = action.payload.facilityId;
          this.selectedMensaName = action.payload.facilityName;
          await this.updateMenu(true);
          this.emit('menuplan_changed');
          break;

        case 'MENU_GOTO_DAY':
          this.displayDay = this.convertSunday(action.payload);
          this.displayWeek = this.createDisplayWeek(this.displayDay);
          await this.updateMenu(false);
          this.emit('menuplan_changed');
          break;

        case 'MENU_SWIPE_RIGHT':
          this.doSwipeRight();
          await this.updateMenu(false);
          this.emit('menuplan_changed');
          break;

        case 'MENU_SWIPE_LEFT':
          this.doSwipeLeft();
          await this.updateMenu(false);
          this.emit('menuplan_changed');
          break;
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  /**
   * Creates array with dates for all days of week of displayDay
   * @param {Date} date
   * @returns {Date[]} weekArray
   */
  createDisplayWeek(date) {
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekArray = Array.apply(null, Array(6));
    return weekArray.map((value, index) => addDays(weekStartDate, index));
  }

  /**
   * Checks if passed date is a Sunday and converts it to a Monday if true
   * @param {Date} date
   * @returns {Date} date
   */
  convertSunday(date) {
    // if currentDate is Sunday, set store currentDate to the Monday after
    if (getDay(date) == 0) {
      return addDays(date, 1);
    } else {
      return date;
    }
  }

  /**
   * Sets currentMenuPlan to menu plan of displayDay
   * @param {boolean} isNewFacility
   */
  async updateMenu(isNewFacility) {
    // Check if facility was changed, currentMenuPlan doesn't exist yet or displayWeek has changed
    if (
      isNewFacility ||
      !this.currentMenuPlan ||
      !isSameDay(startOfWeek(this.displayDay), this.displayStartOfWeek)
    ) {
      // Update displayStartOfWeek and fetch mensa resource
      this.displayStartOfWeek = startOfWeek(this.displayDay);
      this.currentMenuPlan = await api
        .getMensaResource(this.selectedMensaId, this.displayDay)
        .catch(err => {
          this.currentMenuDay = null;
          this.emptyMenuMessage = 'Keine Menüs für dieses Datum gefunden';
        });
    }
    // Set menu plan of displayDay
    if (this.currentMenuPlan) {
      this.emptyMenuMessage = '';
      this.currentMenuDay = this.findCurrentMenuDay();
    }
    // Set info message if no menus exist for the specified displayDay
    if (!this.currentMenuPlan || !this.currentMenuDay) {
      this.currentMenuDay = null;
      this.emptyMenuMessage = 'Keine Menüs für dieses Datum gefunden';
    }
  }

  /**
   * Finds and returns menu offered on displayDay
   * @returns {Object} currentMenuDay
   */
  findCurrentMenuDay() {
    return this.currentMenuPlan.menus.find(menu => {
      return isSameDay(new Date(menu.offeredOn), this.displayDay);
    });
  }

  /**
   * Performs swipe left by subtracting days from displayDay and updating displayWeek
   */
  doSwipeLeft() {
    // If going back from Monday, need to subtract 2 days since Sundays are not displayed
    let daysToSubtract;
    if (getDay(this.displayDay) == 1) {
      daysToSubtract = 2;
    } else {
      daysToSubtract = 1;
    }
    this.displayDay = this.convertSunday(
      addDays(this.displayDay, -daysToSubtract)
    );
    this.displayWeek = this.createDisplayWeek(this.displayDay);
  }

  /**
   * Performs swipe right by adding days from displayDay and updating displayWeek
   */
  doSwipeRight() {
    this.displayDay = this.convertSunday(addDays(this.displayDay, 1));
    this.displayWeek = this.createDisplayWeek(this.displayDay);
  }

  /**
   * Handles errors
   * @param {Error} err
   */
  handleError(err) {
    console.log(err);
  }
}

const mensaStore = new MensaStore();

dispatcher.register(mensaStore.handleActions.bind(mensaStore));

export default mensaStore;
