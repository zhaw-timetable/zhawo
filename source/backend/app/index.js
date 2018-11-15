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

// createFreeRoomsJson();

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
    console.log(allSchedules[0]);
    logger.log(`${fetches} of ${allRooms.length} timetables fetched / tried`);
    let rsd = allSchedules.map(schedule => {
      return;
    });
    console.log(rsd);
  } catch (err) {
    logger.error(err);
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
