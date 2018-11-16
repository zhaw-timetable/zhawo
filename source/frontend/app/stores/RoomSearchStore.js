import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import idb from 'idb';

import * as api from '../adapters/ZhawoAdapter';

class RoomSearchStore extends EventEmitter {
  constructor() {
    super();

    this.freeRooms = [];
  }

  async handleActions(action) {
    switch (action.type) {
      case 'GET_FREEROOMJSON':
        // TODO: save to IDB and then check if there first
        //       save current time to IDB too and check if too old
        this.freeRooms = await api.getFreeRoomsJson().catch(err => {
          console.error(err);
        });
        this.emit('got_FreeRooms');
        break;
    }
  }
}

const roomSearchStore = new RoomSearchStore();

dispatcher.register(roomSearchStore.handleActions.bind(roomSearchStore));

export default roomSearchStore;
