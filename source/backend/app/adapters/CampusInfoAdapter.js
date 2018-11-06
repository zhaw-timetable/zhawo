import fetch from 'node-fetch';
import { format } from 'date-fns';

import logger from '../logger';

const GET = 'GET';
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Zhawo (https://github.com/zhaw-timetable/zhawo)'
};
const apiUrl = 'https://api.apps.engineering.zhaw.ch/v1';

// f.ex. route = students, name = bachmdo2, startDate = date
export function getScheduleResource(route, name, startDate) {
  return new Promise(async (resolve, reject) => {
    const dateString = format(new Date(startDate), 'YYYY-MM-DD');
    const method = GET;
    const headers = HEADERS;
    const config = { method, headers };
    const url = `${apiUrl}/schedules/${route}/${name}?startingAt=${dateString}`;
    const response = await fetch(url, config).catch(err => logger.error(err));
    if (response.status === 200) {
      const json = await response.json().catch(err => logger.error(err));
      json ? resolve(json) : reject();
      logger.log(`Fetched from ${url}`);
    } else {
      resolve({ status: 404 });
    }
  });
}

// f.ex. route = students
export function getPossibleNames(route) {
  return new Promise(async (resolve, reject) => {
    const method = GET;
    const headers = HEADERS;
    const config = { method, headers };
    const url = `${apiUrl}/schedules/${route}/`;
    const response = await fetch(url, config).catch(err => logger.error(err));
    const json = await response.json();
    json ? resolve(json) : reject();
    logger.log(`Fetched from ${url}`);
  });
}
