const POST = 'POST';
const HEADERS = { 'Content-Type': 'application/json' };
let address = 'http://localhost:4000';
if (process.env.NODE_ENV !== 'development') address = window.location.origin;
const apiUrl = `${address}/api/v1`;

export function getResource(base, resource, name, startDate) {
  return new Promise(async (resolve, reject) => {
    const url = `${apiUrl}/${base}/${resource}`;
    const body = JSON.stringify({
      name,
      startDate
    });
    const method = POST;
    const headers = HEADERS;
    const config = { method, body, headers };
    const response = await fetch(url, config).catch(err => console.error(err));
    const json = await response.json().catch(err => console.error(err));
    json ? resolve(json) : reject();
    console.info(`Fetched from ${url}`);
  });
}
