import fs from 'fs-extra';
import logger from './logger';

import * as api from './adapters/CampusInfoAdapter';

export const createFreeRoomsJson = async () => {
  try {
    const myObj = await createFreeRoomsObject();
    await fs.writeFile('./data/room_search_data.json', JSON.stringify(myObj));
  } catch (err) {
    logger.error(err);
  }
};

const createFreeRoomsObject = async () => {
  try {
    let fetches = 0;
    let allRooms = await api.getPossibleNames('rooms');
    allRooms = allRooms.rooms.filter(room => {
      const re = /^\S\S\s\S/;
      const correctPattern = re.test(room);
      return correctPattern;
    });
    let allSchedules = [];
    await asyncForEach(allRooms, async room => {
      let schedule = await api.getScheduleResource(
        'rooms',
        room,
        new Date(),
        1
      );
      fetches++;
      if (schedule && !schedule.status) {
        allSchedules.push(schedule);
      }
    });

    logger.log(`${fetches} of ${allRooms.length} timetables fetched / tried`);

    // Makes the basic structure of freeRoomsBySlot
    // an Object for each slot is made and pushed
    let freeRoomsBySlot = [];
    for (slot of defaultSlots) {
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

    for (var room of allSchedules) {
      freeRoomsBySlotCount = 0;
      if (room.days[0].events.length != 0) {
        for (var event of room.days[0].events) {
          for (var slot of event.slots) {
            slotFound = false;
            lastSlotFound = false;
            while (
              !slotFound &&
              freeRoomsBySlotCount < freeRoomsBySlot.length - 1
            ) {
              if (
                slot.endTime >
                freeRoomsBySlot[freeRoomsBySlotCount].slot.endTime
              ) {
                // Found free Slot
                freeRoomsBySlot[freeRoomsBySlotCount].rooms.push(
                  room.room.name
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
                      room.room.name
                    );
                  }
                }
              }
            }
          }
        }
      } else {
        // No events mean free all day
        for (var freeSlot in freeRoomsBySlot) {
          freeRoomsBySlot[freeSlot].rooms.push(room.room.name);
        }
      }
    }

    logger.log(`FreeRoom List Created`);

    return freeRoomsBySlot;
  } catch (err) {
    logger.error(err);
  }
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

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
