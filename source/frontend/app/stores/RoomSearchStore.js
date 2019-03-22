import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import idb from 'idb';

import { format } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

import SOE from '../assets/img/FloorPlans/SOE';

import TB2 from '../assets/img/FloorPlans/TB/TB2';
import TB3 from '../assets/img/FloorPlans/TB/TB3';
import TB4 from '../assets/img/FloorPlans/TB/TB4';
import TB5 from '../assets/img/FloorPlans/TB/TB5';
import TB6 from '../assets/img/FloorPlans/TB/TB6';

import TE2 from '../assets/img/FloorPlans/TE/TE2';
import TE3 from '../assets/img/FloorPlans/TE/TE3';
import TE4 from '../assets/img/FloorPlans/TE/TE4';
import TE5 from '../assets/img/FloorPlans/TE/TE5';
import TE6 from '../assets/img/FloorPlans/TE/TE6';

import TL2 from '../assets/img/FloorPlans/TL/TL2';
import TL3 from '../assets/img/FloorPlans/TL/TL3';
import TL4 from '../assets/img/FloorPlans/TL/TL4';

import TH2 from '../assets/img/FloorPlans/TH/TH2';
import TH3 from '../assets/img/FloorPlans/TH/TH3';
import TH4 from '../assets/img/FloorPlans/TH/TH4';
import TH5 from '../assets/img/FloorPlans/TH/TH5';

import TP2 from '../assets/img/FloorPlans/TP/TP2';
import TP4 from '../assets/img/FloorPlans/TP/TP4';

class RoomSearchStore extends EventEmitter {
  constructor() {
    super();
    this.currentTimeSlot = '';
    this.freeRooms = [];
    (this.currentFloor = 'SOE'), (this.currentfreeRooms = []);
    this.currentFloors = [];
    this.floors = {
      SOE: SOE,

      TB2: TB2,
      TB3: TB3,
      TB4: TB4,
      TB5: TB5,
      TB6: TB6,

      TE2: TE2,
      TE3: TE3,
      TE4: TE4,
      TE5: TE5,
      TE6: TE6,

      TH2: TH2,
      TH3: TH3,
      TH4: TH4,
      TH5: TH5,

      TL2: TL2,
      TL3: TL3,
      TL4: TL4,

      TP2: TP2,
      TP4: TP4
    };
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
      case 'CHANGE_FLOOR':
        this.setFloor(action.payload);
        this.emit('newFloor');
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

  setFloor(value) {
    let nextFloor = value;
    let tempFloors = [];

    if (nextFloor != 'SOE') {
      // gets building of selected floor
      let building = nextFloor.substring(0, 2);

      // gets all floors of building
      for (let tempFloor in this.floors) {
        if (tempFloor.substring(0, 2) === building) {
          tempFloors.push(tempFloor);
        }
      }
    }
    this.currentFloor = nextFloor;
    this.currentFloors = tempFloors;
  }
}

const roomSearchStore = new RoomSearchStore();

dispatcher.register(roomSearchStore.handleActions.bind(roomSearchStore));

export default roomSearchStore;
