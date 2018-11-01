let basePath = '';

if (process.env.NODE_ENV == 'development') {
  basePath = 'http://localhost:4000';
} else {
  basePath = window.location.origin;
}

const BASE_URL = basePath.concat('/api/v1/timetable');

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

const HEADERS = { 'Content-Type': 'application/json' };

//TODO: add resource param here and do it in general
export function getForStudent(name, startDate) {
  return new Promise(async (resolve, reject) => {
    const url = BASE_URL.concat('/students');
    const method = POST;
    const body = JSON.stringify({
      name,
      startDate
    });
    const headers = HEADERS;
    const config = { method, body, headers };
    const response = await fetch(url, config).catch(err => reject(err));
    const json = await response.json().catch(err => reject(err));
    json ? resolve(json) : reject();
  });
}
