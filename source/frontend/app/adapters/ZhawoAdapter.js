import { format, startOfWeek, subWeeks, addWeeks } from 'date-fns';

const GET = 'GET';
const POST = 'POST';
const HEADERS = { 'Content-Type': 'application/json' };
let address = 'http://localhost:4000';
if (process.env.NODE_ENV === 'production') address = window.location.origin;
const apiUrl = `${address}/api/v1`;

// f.ex. route = students, name = bachmdo2, startDate = date
export function getScheduleResource(route, name, startDate, rangeAroundDate) {
  return new Promise(async (resolve, reject) => {
    let schedule;
    const url = `${apiUrl}/schedules/${route}`;
    const loopStartDate = subWeeks(
      startOfWeek(startDate, { weekStartsOn: 1 }),
      rangeAroundDate
    );
    for (let i = 0; i < rangeAroundDate * 2 + 1; i++) {
      let loadDate = addWeeks(loopStartDate, i);
      let loadDateString = format(loadDate, 'YYYY-MM-DD');
      const body = JSON.stringify({
        name,
        startDate: loadDateString
      });
      const method = POST;
      const headers = HEADERS;
      const config = { method, body, headers };
      const response = await fetch(url, config).catch(err =>
        handleError(err, url)
      );
      const scheduleChunk = await response
        .json()
        .catch(err => handleError(err, url));
      if (scheduleChunk && !scheduleChunk.status) {
        schedule ? null : (schedule = scheduleChunk);
        schedule && schedule.days && scheduleChunk.days
          ? (schedule.days = [...schedule.days, ...scheduleChunk.days])
          : null;
      }
    }
    schedule ? resolve(schedule) : reject({ status: 404 });
  });
}

//

export function getPossibleNames() {
  return new Promise(async (resolve, reject) => {
    const method = GET;
    const headers = HEADERS;
    const config = { method, headers };
    const routes = ['students', 'lecturers', 'classes', 'courses', 'rooms'];
    let possibleNames;
    for (let route of routes) {
      const url = `${apiUrl}/schedules/${route}/`;
      const response = await fetch(url, config).catch(err =>
        handleError(err, url)
      );
      let possibleNamesChunk = await response
        .json()
        .catch(err => handleError(err, url));
      if (possibleNamesChunk && !possibleNamesChunk.status) {
        // clean up received data, don't know why CampusInfo sends different
        // formats for each route..
        switch (route) {
          // these get sent as arrays
          case 'students':
          case 'classes':
          case 'rooms':
            possibleNamesChunk[route] = possibleNamesChunk[route].map(
              value => ({ label: value, type: route })
            );
            break;
          // these as objects with some properties, only need shortName
          case 'lecturers':
            possibleNamesChunk[route] = possibleNamesChunk[route].map(
              value => ({ label: value.shortName, type: route })
            );
            break;
          // these as objects with a DIFFERENT name for the relevant property..
          case 'courses':
            possibleNamesChunk[route] = possibleNamesChunk[route].map(
              value => ({ label: value.name, type: route })
            );
            break;
          default:
            break;
        }
        possibleNames = { ...possibleNames, ...possibleNamesChunk };
      }
    }
    possibleNames ? resolve(possibleNames) : reject({ status: 404 });
  });
}

function handleError(err, url) {
  console.log(`Fetch to ${url} failed with error`, err);
}
