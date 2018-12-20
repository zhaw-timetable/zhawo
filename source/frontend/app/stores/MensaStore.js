import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import { format, getISODay } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

class MensaStore extends EventEmitter {
  constructor() {
    super();
    this.allMensas = [];
    this.selectedMensaName = '';
    this.currentMenuPlan = {};
    this.currentMenuday = '';
    this.currentDate = new Date();
  }

  async handleActions(action) {
    switch (action.type) {
      case 'GET_ALL_MENSAS':
        //TODO: filter out stupid entries in zhawoAdapter
        this.allMensas = await api.getAllMensas();
        this.emit('mensas_loaded');
        break;
      case 'GET_MENUPLAN':
        this.currentMenuPlan = await api.getMensaResource(
          action.payload.facilityId,
          action.payload.date
        );
        this.currentMenuDay = this.currentMenuPlan.menus[
          getISODay(this.currentDate)
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
