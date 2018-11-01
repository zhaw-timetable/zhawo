import fetch from 'node-fetch';
import { format } from 'date-fns';

import logger from '../logger';

const GET = 'GET';
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Zhawo (https://github.com/zhaw-timetable/zhawo)'
};

export function getResource(base, resource, resourceName, startDate) {
  return new Promise(async (resolve, reject) => {
    const dateString = format(new Date(startDate), 'YYYY-MM-DD');
    const config = { GET, HEADERS };
    const url = `https://api.apps.engineering.zhaw.ch/v1/${base}/${resource}/${resourceName}?startingAt=${dateString}`;
    const response = await fetch(url, config).catch(err => logger.error(err));
    const json = await response.json();
    json ? resolve(json) : reject();
    logger.log(`Fetched from ${url}`);
  });
}
