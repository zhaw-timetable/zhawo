import request from 'supertest';
import fetch from 'node-fetch';

import app from './app';

const FETCH_RESPONSE = { status: 'ok' };
const FIXED_DATE = new Date();
const API = '/api/v1/';

beforeEach(() => {
  fetch.resetMocks();
});

it('app should be exported correctly', () => {
  expect(app).toBeDefined();
});

it('GET to /schedules/students/:name should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/students/foobar?startDate=${FIXED_DATE}`;
  const response = await request(app).get(url);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});

it('GET to /schedules/lecturers/:name should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/lecturers/foobar?startDate=${FIXED_DATE}`;
  const response = await request(app).get(url);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});

it('GET to /schedules/rooms/:name should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/rooms/foobar?startDate=${FIXED_DATE}`;
  const response = await request(app).get(url);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});

it('GET to /schedules/classes/:name should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/classes/foobar?startDate=${FIXED_DATE}`;
  const response = await request(app).get(url);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});

it('GET to /schedules/courses/:name should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/courses/foobar?startDate=${FIXED_DATE}`;
  const response = await request(app).get(url);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});
