import fetch from 'node-fetch';
import { format, getYear, getISOWeek } from 'date-fns';

import logger from '../logger';

const GET = 'GET';
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Zhawo (https://github.com/zhaw-timetable/zhawo)'
};
const apiUrl = 'https://api.apps.engineering.zhaw.ch/v1';

/**
 * Functions that handle all communication with CampusInfo Api.
 * @namespace CampusInfoAdapter*/

/**
 * Async Function that gets schedule for a given user starting at start date and for the given amount of days from the Campus Api.
 *
 * @export
 * @param {string} route (lecturers / rooms / students / courses / classes)
 * @param {string} name
 * @param {Date} startDate
 * @param {number} days (default = 7)
 * @return {Promise}  On success the promise will be resolved with a JSON object.<br>
 * On error the promise will be rejected with an { status: 404 }.
 *
 * @memberof CampusInfoAdapter
 */
export function getScheduleResource(route, name, startDate, days = 7) {
  return new Promise(async (resolve, reject) => {
    const dateString = format(new Date(startDate), 'YYYY-MM-DD');
    const method = GET;
    const headers = HEADERS;
    const config = { method, headers };
    const url = `${apiUrl}/schedules/${route}/${name}?startingAt=${dateString}&days=${days}`;
    const response = await fetch(url, config).catch(err => logger.error(err));
    if (response && response.status === 200) {
      const json = await response.json().catch(err => logger.error(err));
      json ? resolve(json) : reject();
      logger.log(`Fetched from ${url}`);
    } else {
      resolve({ status: 404 });
    }
  });
}

/**
 * Async Function that get all the possible name for a given group (route) from the Campus Api.
 *
 * @export
 * @param {string} route (lecturers / rooms / students / courses / classes)
 * @return {Promise}  On success the promise will be resolved with a JSON object.<br>
 * On error the promise will be rejected.
 *
 *  @memberof CampusInfoAdapter
 */
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

/**
 * Async Function that gets a list of all the Mensa Facilities from the Campus Api.
 *
 * @export
 * @return {Promise}  On success the promise will be resolved with a JSON object.<br>
 * On error the promise will be rejected.
 *
 * @memberof CampusInfoAdapter
 */
export function getFacilities() {
  return new Promise(async (resolve, reject) => {
    const method = GET;
    const headers = HEADERS;
    const config = { method, headers };
    const url = `${apiUrl}/catering/facilities/`;
    const response = await fetch(url, config).catch(err => logger.error(err));
    const json = await response.json();
    json ? resolve(json.gastronomicFacilities) : reject();
    logger.log(`Fetched from ${url}`);
  });
}

/**
 * Async Function that gets Mensa menus for a given facility from the Campus Api.
 *
 * @export
 * @param {number} facilityId
 * @param {Date} date
 * @return {Promise}  On success the promise will be resolved with a JSON object.<br>
 * On error the promise will be rejected.
 *
 * @memberof CampusInfoAdapter
 */
export function getMensaResource(facilityId, date) {
  return new Promise(async (resolve, reject) => {
    const dateObj = new Date(date);
    const year = getYear(dateObj);
    const week = getISOWeek(dateObj);
    const method = GET;
    const headers = HEADERS;
    const config = { method, headers };
    const url = `${apiUrl}/catering/menuplans/years/${year}/weeks/${week}`;
    const response = await fetch(url, config).catch(err => logger.error(err));
    const json = await response.json();
    json
      ? resolve(filterMenuPlansByFacilityId(json.menuPlans, facilityId))
      : reject();
    logger.log(`Fetched from ${url}`);
  });
}

/**
 * Function that filters a given list of menu plans for a facilityId.
 *
 * @param {*} menuPlans
 * @param {*} facilityId
 * @returns Menu Plan
 *
 * @memberof CampusInfoAdapter
 */
function filterMenuPlansByFacilityId(menuPlans, facilityId) {
  let filteredMenuPlans = menuPlans.filter(menuPlan =>
    menuPlan.gastronomicFacilityIds.includes(Number(facilityId))
  );
  return filteredMenuPlans;
}
