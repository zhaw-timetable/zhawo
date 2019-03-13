import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import { format, startOfWeek, getISODay, addDays } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

class MensaStore extends EventEmitter {
  constructor() {
    super();
    this.allMensas = [];
    this.selectedMensaName = '';
    this.currentMenuPlan = {};
    this.currentMenuDay = '';
    this.currentDate = new Date();
    this.displayDay = this.currentDate;
    this.displayWeek = this.createDisplayWeek(this.displayDay);
  }

  createDisplayWeek(date) {
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekArray = Array.apply(null, Array(6));
    return weekArray.map((value, index) => addDays(weekStartDate, index));
  }

  async handleActions(action) {
    switch (action.type) {
      case 'GET_ALL_MENSAS':
        this.allMensas = await api.getAllMensas();
        console.log(this.allMensas);
        this.emit('mensas_loaded');
        break;
      case 'GET_MENUPLAN':
        this.currentMenuPlan = await api
          .getMensaResource(action.payload.facilityId, action.payload.date)
          .catch(err => console.log(err));
        this.currentMenuDay = this.currentMenuPlan.menus[
          getISODay(this.currentDate) - 1
        ];
        this.selectedMensaName = action.payload.facilityName;
        this.emit('menuplan_changed');
        break;
    }
  }
}

const mensaStore = new MensaStore();

dispatcher.register(mensaStore.handleActions.bind(mensaStore));

export default mensaStore;
