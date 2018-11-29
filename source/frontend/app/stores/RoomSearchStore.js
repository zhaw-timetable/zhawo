import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import idb from 'idb';

import { format } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

class RoomSearchStore extends EventEmitter {
  constructor() {
    super();
    this.currentTimeSlot = '';
    this.freeRooms = [];
    this.currentfreeRooms = [];
  }

  async handleActions(action) {
    switch (action.type) {
      case 'GET_FREEROOMJSON':
        // TODO: save to IDB and then check if there first
        //       save current time to IDB too and check if too old
        this.freeRooms = await api.getFreeRoomsJson().catch(err => {
          console.error(err);
        });
        this.currentfreeRooms = this.getSortedByTimeSlot(this.currentTimeSlot);
        this.emit('got_currentFreeRooms');
        break;
      case 'GET_FREEROOMBYTIME':
        this.currentTimeSlot = action.payload;
        this.currentfreeRooms = this.getSortedByTimeSlot(this.currentTimeSlot);
        this.emit('got_currentFreeRooms');
        break;
    }
  }

  getSortedByTimeSlot(value) {
    // Find timeslot

    if (value) {
      let found = false;
      let count = 0;
      // Todo: and smaller than slots count
      while (!found) {
        if (
          format(this.freeRooms[count].slot.startTime, 'HH:mm') ===
          format(value, 'HH:mm')
        ) {
          found = true;
        } else {
          count++;
        }
      }
      return this.freeRooms[count].rooms;
    }

    return [];
  }
}

const roomSearchStore = new RoomSearchStore();

dispatcher.register(roomSearchStore.handleActions.bind(roomSearchStore));

export default roomSearchStore;
