import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import { startOfWeek, addDays, getDay, isSameDay } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

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

  createDisplayWeek(date) {
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekArray = Array.apply(null, Array(6));
    return weekArray.map((value, index) => addDays(weekStartDate, index));
  }

  convertSunday(date) {
    // if currentDate is Sunday, set store currentDate to the Monday after
    if (getDay(date) == 0) {
      return addDays(date, 1);
    } else {
      return date;
    }
  }

  async updateMenu(isNewFacility) {
    if (
      isNewFacility ||
      !this.currentMenuPlan ||
      !isSameDay(startOfWeek(this.displayDay), this.displayStartOfWeek)
    ) {
      this.displayStartOfWeek = startOfWeek(this.displayDay);
      this.currentMenuPlan = await api
        .getMensaResource(this.selectedMensaId, this.displayDay)
        .catch(err => {
          this.currentMenuDay = null;
          this.emptyMenuMessage = 'Keine Menüs für dieses Datum gefunden';
        });
    }
    if (this.currentMenuPlan) {
      this.emptyMenuMessage = '';
      this.currentMenuDay = this.findCurrentMenuDay();
    }
    if (!this.currentMenuPlan || !this.currentMenuDay) {
      this.currentMenuDay = null;
      this.emptyMenuMessage = 'Keine Menüs für dieses Datum gefunden';
    }
  }

  findCurrentMenuDay() {
    return this.currentMenuPlan.menus.find(menu => {
      return isSameDay(new Date(menu.offeredOn), this.displayDay);
    });
  }

  async handleActions(action) {
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
        this.displayDay = this.convertSunday(addDays(this.displayDay, 1));
        this.displayWeek = this.createDisplayWeek(this.displayDay);
        await this.updateMenu(false);
        this.emit('menuplan_changed');
        break;

      case 'MENU_SWIPE_LEFT':
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
        await this.updateMenu(false);
        this.emit('menuplan_changed');
        break;
    }
  }
}

const mensaStore = new MensaStore();

dispatcher.register(mensaStore.handleActions.bind(mensaStore));

export default mensaStore;
