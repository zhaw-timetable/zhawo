import '@babel/polyfill';

import fs from 'fs-extra';
import logger from './logger';

import * as api from './adapters/CampusInfoAdapter';

import app from './app';
import config from './config.json';

app.server.listen(process.env.PORT || config.port, () => {
  let host = app.server.address().address;
  host = host == '::' ? 'localhost' : host;
  logger.log(
    `Express.js server listening on http://${host}:${app.server.address().port}`
  );
});

//TODO: everything below is just experimental

// run every 24hrs
// setInterval(createFreeRoomsJson, 1000*60*60*24);
let count = 0;
setInterval(createFreeRoomsJson, 1000);

createFreeRoomsJson();

async function createFreeRoomsJson() {
  try {
    const myObj = { seconds: count++ };
    await fs.writeFile('./data/room_search_data.json', JSON.stringify(myObj));
    // logger.log('Created room_search_data.json');
  } catch (err) {
    logger.error(err);
  }
}

createFreeRoomsObject();

async function createFreeRoomsObject() {
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
      if (fetches > 50) return;
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
    for (slot of allSchedules[0].days[0].slots) {
      let temp = {
        slot: slot,
        rooms: []
      };
      freeRoomsBySlot.push(temp);
    }

    let slotFound;
    let lastSlotFound;
    let freeRoomsBySlotCount; // so that each slot is only checked once

    for (var room of allSchedules) {
      freeRoomsBySlotCount = 0;
      console.log(room.room.name);
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
                console.log('Found Free Slot', slot.startTime, slot.endTime);
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
                  console.log('Empty Events so adding room to remaining slots');

                  // skip all the slots that are in last event
                  if (!lastSlotFound) {
                    freeRoomsBySlotCount += event.slots.length;
                    lastSlotFound = true;
                  } else {
                    freeRoomsBySlotCount++;
                  }
                  // TODO: figure out why sometime undefined
                  //       event in last slot maybe?
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
        console.log('Empty Events so adding room to every slot');
        for (var freeSlot in freeRoomsBySlot) {
          freeRoomsBySlot[freeSlot].rooms.push(room.room.name);
        }
      }
    }

    logger.log(`FreeRoom List Created`);

    console.log(freeRoomsBySlot);

    // Used to test
    console.log(allSchedules[3].room.name);
    console.log(allSchedules[3].days[0].events);
  } catch (err) {
    logger.error(err);
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
