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
    this.startTime = '';
    this.endTime = '';
    this.timeSlots;
    this.freeRooms = [];
    this.currentFloor = 'SOE';
    this.currentfreeRooms = [];
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
        this.timeSlots = this.getTimeSlotsBetweenTimes(
          this.startTime,
          this.endTime
        );
        //this.currentfreeRooms = this.getSortedByTimeSlot(this.starTime);
        this.emit('got_currentFreeRooms');
        break;
      case 'GET_FREEROOMBYTIME':
        //this.currentTimeSlot = action.payload;
        this.startTime = action.start;
        this.endTime = action.end;
        this.timeSlots = this.getTimeSlotsBetweenTimes(
          this.startTime,
          this.endTime
        );

        this.currentfreeRooms = this.filterRooms(this.timeSlots);
        this.emit('got_currentFreeRooms');
        break;
      case 'CHANGE_FLOOR':
        this.setFloor(action.payload);
        //this.currentfreeRooms = this.getSortedByTimeSlot(this.starTime);
        this.emit('newFloor');
        break;
    }
  }

  filterRooms(timeSlots) {
    let freeRoomArrays = [];
    for (let i = 0; i < timeSlots.length; i++) {
      freeRoomArrays.push(this.getSortedByTimeSlotIndex(timeSlots[i]));
    }
    let tempFreeRooms = freeRoomArrays[0];
    for (let j = 1; j < freeRoomArrays.length; j++) {
      tempFreeRooms = this.getCommonElements(tempFreeRooms, freeRoomArrays[j]);
    }

    console.log('Current Free Rooms: ', tempFreeRooms);
    return tempFreeRooms;
  }

  getCommonElements(array1, array2) {
    let res = array1.filter(function(v) {
      // iterate over the array
      // check element present in the second array
      return array2.includes(v);
    });
    return res;
  }

  // Gets indexes of all the time slots between to times
  getTimeSlotsBetweenTimes(start, end) {
    // Todo: end time before start time
    let slots = [];
    if (start && end) {
      let found = false;
      let count = 0;

      // find start slot
      while (!found) {
        if (
          format(this.freeRooms[count].slot.startTime, 'HH:mm') ===
          format(start, 'HH:mm')
        ) {
          found = true;
          slots.push(count);
          count++;
        } else {
          count++;
        }
      }
      for (count; count < this.freeRooms.length; count++) {
        slots.push(count);
        if (this.freeRooms[count].slot.endTime == end) {
          return slots;
        }
      }
    }
    return slots;
  }

  getSortedByTimeSlotIndex(index) {
    let tempRooms = [];

    // Find timeslot
    let found = false;
    let tempRoom;

    if (this.currentFloor != 'SOE') {
      // Only add free rooms of same building
      for (let room in this.freeRooms[index].rooms) {
        tempRoom = this.freeRooms[index].rooms[room];
        // Check if same level
        if (this.currentFloor.substring(0, 2) === tempRoom.substring(0, 2)) {
          tempRooms.push(tempRoom);
        }
      }
    } else {
      // if not in building return all the free rooms
      tempRooms = this.freeRooms[index].rooms;
    }
    return tempRooms;
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
