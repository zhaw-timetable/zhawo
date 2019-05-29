import fs from 'fs-extra';
import logger from './logger';
import { isAfter, format } from 'date-fns';

import * as api from './adapters/CampusInfoAdapter';

/**
 * Async Function that creates new freeRooms Object using createFreeRoomsObject and then writes it to a json file.
 *
 */
export async function createFreeRoomsJson() {
  try {
    const myObj = await createFreeRoomsObject();
    await fs.writeFile('./data/room_search_data.json', JSON.stringify(myObj));
  } catch (err) {
    logger.error(err);
  }
}

/**
 * Async Function that creates a Object that contains all free Rooms for current day.
 * @returns Object containing all free Rooms
 */
export async function createFreeRoomsObject() {
  try {
    let fetches = 0;
    const currentDate = new Date();
    let allRooms = allValidRooms;
    let allSchedules = [];
    await asyncForEach(allRooms, async room => {
      let schedule = await api.getScheduleResource(
        'rooms',
        room,
        currentDate,
        1
      );
      fetches++;
      if (schedule && !schedule.status) {
        allSchedules.push(schedule);
      } else {
        let defaultSchedule = {
          course: null,
          days: [{ date: currentDate, events: [], slots: defaultSlots }],
          lecturer: null,
          room: { name: room },
          class: null,
          student: null,
          type: 'Room'
        };
        allSchedules.push(defaultSchedule);
      }
    });

    logger.log(`${fetches} of ${allRooms.length} timetables fetched / tried`);

    // Makes the basic structure of freeRoomsBySlot
    // an Object for each slot is made and pushed
    let freeRoomsBySlot = [];
    for (let slot of defaultSlots) {
      let temp = {
        slot: slot,
        rooms: []
      };
      freeRoomsBySlot.push(temp);
    }

    let slotFound;
    let lastSlotFound;
    // so that each slot is only checked once
    let freeRoomsBySlotCount;

    for (let room of allSchedules) {
      freeRoomsBySlotCount = 0;
      if (room.days[0].events.length != 0) {
        for (let event of room.days[0].events) {
          for (let slot of event.slots) {
            slotFound = false;
            lastSlotFound = false;
            while (
              !slotFound &&
              freeRoomsBySlotCount < freeRoomsBySlot.length - 1
            ) {
              if (
                // Check if first is after second
                isAfter(
                  format(slot.endTime, 'HHmm'),
                  format(
                    freeRoomsBySlot[freeRoomsBySlotCount].slot.endTime,
                    'HHmm'
                  )
                )
              ) {
                // Found free Slot
                freeRoomsBySlot[freeRoomsBySlotCount].rooms.push(
                  room.room.name.replace(/\s/g, '').toUpperCase()
                );
                freeRoomsBySlotCount++;
              } else {
                // Don't set slotFound to true if it is the last event
                if (
                  event != room.days[0].events[room.days[0].events.length - 1]
                ) {
                  slotFound = true;
                  freeRoomsBySlotCount++;
                } else {
                  //Empty Event so adding room to remaining slots
                  // skip all the slots that are in last event
                  if (!lastSlotFound) {
                    freeRoomsBySlotCount += event.slots.length;
                    lastSlotFound = true;
                  } else {
                    freeRoomsBySlotCount++;
                  }
                  if (freeRoomsBySlot[freeRoomsBySlotCount]) {
                    freeRoomsBySlot[freeRoomsBySlotCount].rooms.push(
                      room.room.name.replace(/\s/g, '').toUpperCase()
                    );
                  }
                }
              }
            }
          }
        }
      } else {
        // No events mean free all day
        for (let freeSlot in freeRoomsBySlot) {
          freeRoomsBySlot[freeSlot].rooms.push(
            room.room.name.replace(/\s/g, '').toUpperCase()
          );
        }
      }
    }
    logger.log(`FreeRoom List Created`);
    return freeRoomsBySlot;
  } catch (err) {
    logger.error(err);
  }
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

/**
 * All rooms that could be available for students to study
 */
const allValidRooms = [
  'tp 208',
  'tp 212',
  'tp 402',
  'tp 404',
  'tp 405',
  'tp 406',
  'tp 407',
  'tp 408',
  'tp 410',
  'th 263',
  'th 331',
  'th 333',
  'th 335',
  'th 343',
  'th 344',
  'th 363',
  'th 368',
  'th 431',
  'th 433',
  'th 444',
  'th 541',
  'th 544',
  'th 547',
  'th 553',
  'th 561',
  'th 567',
  'th 568',
  'tb 230',
  'tb 330',
  'tb 320',
  'tb 404',
  'tb 410',
  'tb 414',
  'tb 426',
  'tb 432',
  'tb 434',
  'tb 504',
  'tb 510',
  'tb 514',
  'tb 526',
  'tb 532',
  'tb 610',
  'tb 630',
  'te 214',
  'te 216',
  'te 225',
  'te 220',
  'te 314',
  'te 316',
  'te 319',
  'te 402',
  'te 407',
  'te 414',
  'te 419',
  'te 423',
  'te 502',
  'te 507',
  'te 514',
  'te 516',
  'te 519',
  'te 523',
  'te 524',
  'te 528',
  'te 602',
  'te 606',
  'te 616',
  'te 622',
  'te 626',
  'tl 201',
  'tl 412',
  'tl 418',
  'tl 424',
  'tl 430'
];

/**
 * Default slots
 */
const defaultSlots = [
  {
    endTime: '2018-10-29T08:45:00+01:00',
    startTime: '2018-10-29T08:00:00+01:00'
  },
  {
    endTime: '2018-10-29T09:35:00+01:00',
    startTime: '2018-10-29T08:50:00+01:00'
  },
  {
    endTime: '2018-10-29T10:45:00+01:00',
    startTime: '2018-10-29T10:00:00+01:00'
  },
  {
    endTime: '2018-10-29T11:35:00+01:00',
    startTime: '2018-10-29T10:50:00+01:00'
  },
  {
    endTime: '2018-10-29T12:45:00+01:00',
    startTime: '2018-10-29T12:00:00+01:00'
  },
  {
    endTime: '2018-10-29T13:35:00+01:00',
    startTime: '2018-10-29T12:50:00+01:00'
  },
  {
    endTime: '2018-10-29T14:45:00+01:00',
    startTime: '2018-10-29T14:00:00+01:00'
  },
  {
    endTime: '2018-10-29T15:35:00+01:00',
    startTime: '2018-10-29T14:50:00+01:00'
  },
  {
    endTime: '2018-10-29T16:45:00+01:00',
    startTime: '2018-10-29T16:00:00+01:00'
  },
  {
    endTime: '2018-10-29T17:35:00+01:00',
    startTime: '2018-10-29T16:50:00+01:00'
  },
  {
    endTime: '2018-10-29T18:30:00+01:00',
    startTime: '2018-10-29T17:45:00+01:00'
  },
  {
    endTime: '2018-10-29T19:25:00+01:00',
    startTime: '2018-10-29T18:40:00+01:00'
  },
  {
    endTime: '2018-10-29T20:10:00+01:00',
    startTime: '2018-10-29T19:25:00+01:00'
  },
  {
    endTime: '2018-10-29T21:05:00+01:00',
    startTime: '2018-10-29T20:20:00+01:00'
  },
  {
    endTime: '2018-10-29T21:50:00+01:00',
    startTime: '2018-10-29T21:05:00+01:00'
  }
];
