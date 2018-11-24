import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import idb from 'idb';

import { format } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

class RoomSearchStore extends EventEmitter {
  constructor() {
    super();
    this.currentTimeSlot = '2018-11-19T08:00:00+01:00';
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
        // First timeslot
        this.currentTimeSlot = this.freeRooms[0].slot.startTime;
        this.currentfreeRooms = this.getSortedByTimeSlot(this.currentTimeSlot);
        this.emit('got_currentFreeRooms');
        break;
      case 'GET_FREEROOMBYTIME':
        console.log(action.payload);
        this.currentTimeSlot = action.payload;
        this.currentfreeRooms = this.getSortedByTimeSlot(this.currentTimeSlot);
        console.log(this.currentfreeRooms);
        this.emit('got_currentFreeRooms');
        break;
    }
  }

  getSortedByTimeSlot(value) {
    // Find timeslot
    let found = false;
    let count = 0;
    // Todo: and smaller the slots count
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
    console.log(this.freeRooms[count].rooms);
    return this.freeRooms[count].rooms;
  }
}

const roomSearchStore = new RoomSearchStore();

dispatcher.register(roomSearchStore.handleActions.bind(roomSearchStore));

export default roomSearchStore;
