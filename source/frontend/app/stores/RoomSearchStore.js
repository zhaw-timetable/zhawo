import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

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

/**
 * A flux action with a type and optional payload
 * @typedef {Object} FluxAction
 * @property {string} type
 * @property {Object} [payload]
 */

/**
 * Flux Store RoomSearchStore
 */
class RoomSearchStore extends EventEmitter {
  constructor() {
    super();
    this.allRooms = [];
    this.currentFreeRooms = [];
    this.currentBuildingFloors = [];
    this.currentFloor = 'SOE';
    this.allFloors = {
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
        case 'FETCH_FREE_ROOM_DATA':
          this.allRooms = await this.fetchFreeRoomData();
          this.emit('free_rooms_changed');
          break;
        case 'GET_FREE_ROOMS_BY_TIME':
          const { startTime, endTime } = action.payload;
          this.currentFreeRooms = this.getCurrentFreeRooms(startTime, endTime);
          this.emit('free_rooms_changed');
          break;
        case 'CHANGE_FLOOR':
          const selectedFloor = action.payload;
          this.currentFloor = selectedFloor;
          this.currentBuildingFloors = this.getBuildingFloors(selectedFloor);
          this.emit('selected_floor_changed');
          break;
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  /**
   * Slot containing startTime and endTime as strings
   * @typedef {Object} Slot
   * @property {string} startTime
   * @property {string} endTime
   */

  /**
   * Floor containing slot and free rooms during that slot
   * @typedef {Object} Floor
   * @property {Slot} slot
   * @property {string[]} rooms
   */

  /**
   * Fetches all available rooms from backend api
   * @async
   * @return {Promise<Floor[]>} allRooms
   */
  async fetchFreeRoomData() {
    let allRooms = this.allRooms;
    if (allRooms.length === 0) {
      allRooms = await api.getFreeRoomsJson().catch(err => {
        this.handleError(err);
      });
    }
    return allRooms;
  }

  /**
   * @param {string} startTime
   * @param {string} endTime
   * @param {string[]} currentFreeRooms
   */
  getCurrentFreeRooms(startTime, endTime) {
    // Get indices of selected timeslots
    const timeSlotIndices = this.getTimeSlotsBetweenTimes(startTime, endTime);
    // Create array with x arrays of free rooms for x selected timeslots
    let freeRoomArrays = [];
    for (let i = 0; i < timeSlotIndices.length; i++) {
      let timeSlotIndex = timeSlotIndices[i];
      freeRoomArrays.push(this.allRooms[timeSlotIndex].rooms);
    }
    // Loop through freeRoomArrays and in each iteration, only keep rooms that are free in both slots.
    // By the end of the loop, only rooms that are free in all selected timeslots remain.
    let currentFreeRooms = freeRoomArrays[0];
    for (let j = 1; j < freeRoomArrays.length; j++) {
      currentFreeRooms = this.getCommonElements(
        currentFreeRooms,
        freeRoomArrays[j]
      );
    }
    // Return filtered array
    return currentFreeRooms;
  }

  /**
   * Takes two arrays of strings and returns new array with elements
   * that are in both arrays
   * @param {string[]} array1
   * @param {string[]} array2
   * @return {string[]} filteredArray
   */
  getCommonElements(array1, array2) {
    let filteredArray = array1.filter(function(v) {
      // iterate over the array
      // check element present in the second array
      return array2.includes(v);
    });
    return filteredArray;
  }

  /**
   * Returns all indices of timeslot array that are between startTime and endTime
   * @param {string} startTime
   * @param {string} endTime
   * @returns {number[]} slotIndices
   */
  getTimeSlotsBetweenTimes(startTime, endTime) {
    let slotIndices = [];
    let searchIndex = 0;
    let foundStart = false;
    // Find index of start slot in allRooms slots
    while (!foundStart && searchIndex < this.allRooms.length) {
      let slotStartTime = this.allRooms[searchIndex].slot.startTime;
      if (format(slotStartTime, 'HH:mm') === format(startTime, 'HH:mm')) {
        foundStart = true;
      } else {
        searchIndex++;
      }
    }
    // Push indices to array until endTime is reached
    for (searchIndex; searchIndex < this.allRooms.length; searchIndex++) {
      let slotEndTime = this.allRooms[searchIndex].slot.endTime;
      slotIndices.push(searchIndex);
      if (format(slotEndTime, 'HH:mm') === format(endTime, 'HH:mm')) {
        break;
      }
    }
    return slotIndices;
  }

  /**
   * Returns all floors that match the building identifier of the selected floor
   * @param {string} selectedFloor
   * @returns {JSX.Element[]} currentBuildingFloors
   */
  getBuildingFloors(selectedFloor) {
    let currentBuildingFloors = [];
    if (selectedFloor != 'SOE') {
      // extract building identifier from floor string
      const buildingId = selectedFloor.substring(0, 2);
      // gets all floors of same building as selectedFloor
      for (let floor in this.allFloors) {
        if (floor.substring(0, 2) === buildingId) {
          currentBuildingFloors.push(floor);
        }
      }
    }
    return currentBuildingFloors;
  }

  /**
   * Handles errors
   * @param {Error} err
   */
  handleError(err) {
    console.log(err);
  }
}

const roomSearchStore = new RoomSearchStore();

dispatcher.register(roomSearchStore.handleActions.bind(roomSearchStore));

export default roomSearchStore;
