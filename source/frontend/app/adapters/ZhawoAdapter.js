import { format, startOfWeek, subWeeks, addWeeks } from 'date-fns';

const GET = 'GET';
const POST = 'POST';
const HEADERS = { 'Content-Type': 'application/json' };
let address = 'http://localhost:4000';
if (process.env.NODE_ENV !== 'development') address = window.location.origin;
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
      if (!scheduleChunk.status) {
        schedule ? null : (schedule = scheduleChunk);
        schedule && schedule.days && scheduleChunk.days
          ? (schedule.days = [...schedule.days, ...scheduleChunk.days])
          : null;
      }
    }
    schedule ? resolve(schedule) : reject({ status: 404 });
    console.info(`Fetched from ${url}`);
  });
}

// f.ex. route = students
export function getPossibleNames(route) {
  return new Promise(async (resolve, reject) => {
    const method = GET;
    const headers = HEADERS;
    const config = { method, headers };
    const url = `${apiUrl}/schedules/${route}/`;
    const response = await fetch(url, config).catch(err => console.error(err));
    const json = await response.json();
    json ? resolve(json) : reject();
    console.info(`Fetched from ${url}`);
  });
}

function handleError(err, ulr) {
  console.log(`Fetch to ${url} failed with error`, err);
}
