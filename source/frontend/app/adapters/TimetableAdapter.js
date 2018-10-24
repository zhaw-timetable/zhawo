import { apiUrl } from '../config.json';

const BASE_URL = apiUrl.concat('/api/timetable');

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export function fetchByUsername(userName, startDate) {
  return new Promise(async (resolve, reject) => {
    const url = BASE_URL.concat('/username');
    const method = POST;
    const body = JSON.stringify({
      userName,
      startDate
    });
    const headers = DEFAULT_HEADERS;
    const config = { method, body, headers };
    const response = await fetch(url, config).catch(err => reject(err));
    const json = await response.json().catch(err => reject(err));
    json && resolve(json);
  });
}
