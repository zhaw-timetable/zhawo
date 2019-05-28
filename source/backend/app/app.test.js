import request from 'supertest';
import fetch from 'node-fetch';
import fs from 'fs-extra';

import app from './app';

import * as vszhawApi from './adapters/VszhawAdapter';
import * as api from './adapters/CampusInfoAdapter';

const FETCH_RESPONSE = { status: 'ok' };
const FETCH_RESPONSE_FACILITIES = { gastronomicFacilities: FETCH_RESPONSE };
const FETCH_RESPONSE_MENSA = {
  menuPlans: [{ gastronomicFacilityIds: [1, 2] }]
};
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

it('GET to /schedules/students/ should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/students/`;
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

it('GET to /schedules/lecturers/ should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/lecturers/`;
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

it('GET to /schedules/rooms/ should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/rooms/`;
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

it('GET to /schedules/classes/ should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/classes/`;
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

it('GET to /schedules/courses/ should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/courses/`;
  const response = await request(app).get(url);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});

it('GET to /mensa/ should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE_FACILITIES));
  const url = `${API}/mensa/`;
  const response = await request(app).get(url);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});

it('GET to /mensa/menus/:facilityId should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE_MENSA));
  const url = `${API}/mensa/menus/1?startDate=${FIXED_DATE}`;
  const response = await request(app).get(url);
  expect(response.body).toEqual([{ gastronomicFacilityIds: [1, 2] }]);
  expect(fetch).toHaveBeenCalled();
});

it('GET to /vszhaw/ should respond correctly', async () => {
  vszhawApi.getVszhawRSS = jest.fn().mockReturnValue('vszhawFeed');
  const url = `${API}/vszhaw/`;
  const response = await request(app).get(url);
  expect(response.body).toEqual('vszhawFeed');
  expect(vszhawApi.getVszhawRSS).toHaveBeenCalled();
  vszhawApi.getVszhawRSS.mockRestore();
});

it('GET to /vszhaw/events should respond correctly', async () => {
  vszhawApi.getVszhawEvents = jest.fn().mockReturnValue('vszhawEvents');
  const url = `${API}/vszhaw/events/`;
  const response = await request(app).get(url);
  expect(response.body).toEqual('vszhawEvents');
  expect(vszhawApi.getVszhawEvents).toHaveBeenCalled();
  vszhawApi.getVszhawEvents.mockRestore();
});

it('GET to /roomsearch/ should respond correctly', async () => {
  jest.mock('fs-extra');
  fs.readJson = jest.fn().mockReturnValue(Promise.resolve('freeRooms'));
  const url = `${API}/roomsearch/`;
  const response = await request(app).get(url);
  expect(response.body).toEqual('freeRooms');
  expect(fs.readJson).toHaveBeenCalled();
  vszhawApi.getVszhawEvents.mockRestore();
});
