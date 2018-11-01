import request from 'supertest';
import fetch from 'node-fetch';
import { format } from 'date-fns';

import * as api from './CampusInfoAdapter';

const FIXED_DATE = new Date();
const FETCH_RESPONSE = { status: 'ok' };

beforeEach(() => {
  fetch.resetMocks();
});

it('all functions shhould be exported', () => {
  expect(api).toBeDefined();
  expect(api.getScheduleResource).toBeDefined();
  expect(api.getPossibleNames).toBeDefined();
});

it('getScheduleResource should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const route = 'students';
  const name = 'foobar';
  const dateString = format(FIXED_DATE, 'YYYY-MM-DD');
  await api.getScheduleResource(route, name, FIXED_DATE);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(
    `/schedules/students/foobar?startingAt=${dateString}`
  );
});

it('getScheduleResource should resolve with correct response', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const route = 'students';
  const name = 'foobar';
  const response = await api.getScheduleResource(route, name, FIXED_DATE);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

it('getPossibleNames should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const route = 'students';
  await api.getPossibleNames(route);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`/schedules/students/`);
});

it('getPossibleNames should resolve with correct response', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const route = 'students';
  const response = await api.getPossibleNames(route);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});
