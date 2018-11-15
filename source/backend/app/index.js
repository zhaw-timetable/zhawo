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
    //console.log(allSchedules[0]);
    //console.log(allSchedules.length);
    logger.log(`${fetches} of ${allRooms.length} timetables fetched / tried`);
    let freeRoomsBySlot = [];

    for (slot in allSchedules[0].days[0].slots) {
      let temp = {
        name: slot,
        slot: allSchedules[0].days[0].slots[slot],
        rooms: []
      };
      freeRoomsBySlot.push(temp);
    }

    //console.log(freeRoomsBySlot);

    let slotFound;
    let freeRoomsBySlotCount;

    for (var room of allSchedules) {
      //console.log(room.room.name);
      freeRoomsBySlotCount = 0;
      console.log(room.days[0].events);
      if (room.days[0].events.length != 0) {
        for (var event of room.days[0].events) {
          //console.log(event);

          //console.log(event.slots);
          for (var slot of event.slots) {
            //console.log(slot);
            slotFound = false;

            while (
              !slotFound &&
              freeRoomsBySlotCount < freeRoomsBySlot.length - 1
            ) {
              // console.log(
              //   slot.endTime,
              //   'and',
              //   freeRoomsBySlot[freeRoomsBySlotCount].slot.endTime
              // );
              if (
                slot.endTime >
                freeRoomsBySlot[freeRoomsBySlotCount].slot.endTime
              ) {
                console.log('Found Free');
                freeRoomsBySlot[freeRoomsBySlotCount].rooms.push(
                  room.room.name
                );
                freeRoomsBySlotCount++;
              } else {
                if (slot != event.slots[event.slots.length - 1]) {
                  slotFound = true;
                } else {
                  console.log('Filling after last slot in events');
                  freeRoomsBySlotCount++;
                  // console.log(
                  //   freeRoomsBySlot[freeRoomsBySlotCount].slot.endTime
                  // );
                  freeRoomsBySlot[freeRoomsBySlotCount].rooms.push(
                    room.room.name
                  );
                }
              }
            }
          }
        }
      } else {
        // No events mean free all day
        console.log('Empty Events so just fulling up');
        for (var freeSlot in freeRoomsBySlot) {
          //console.log('adding', room.room.name, 'to slot: ', freeSlot);
          freeRoomsBySlot[freeSlot].rooms.push(room.room.name);
        }
      }
    }

    console.log(freeRoomsBySlot);
  } catch (err) {
    logger.error(err);
  }
}

function checkIfSlotIsFree() {}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
