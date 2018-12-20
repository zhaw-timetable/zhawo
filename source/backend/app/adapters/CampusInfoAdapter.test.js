import fetch from 'node-fetch';
import { format } from 'date-fns';

import * as api from './CampusInfoAdapter';

const FIXED_DATE = new Date();
const FETCH_RESPONSE = { status: 'ok' };
const FETCH_RESPONSE_REJECT = { status: 'not_ok' };
const FETCH_RESPONSE_FACILITIES = { gastronomicFacilities: FETCH_RESPONSE };
const FETCH_RESPONSE_MENSA = {
  menuPlans: [{ gastronomicFacilityIds: [1, 2] }]
};

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

it('getScheduleResource should resolve with status 404 if response from api is not 200', async () => {
  fetch.mockReject(FETCH_RESPONSE_REJECT);
  const route = 'students';
  const name = 'foobar';
  const response = await api.getScheduleResource(route, name, FIXED_DATE);
  expect(response).toBeDefined();
  expect(response).toEqual({ status: 404 });
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

it('getFacilities should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  await api.getFacilities();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`/catering/facilities/`);
});

it('getFacilities should resolve with correct response', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE_FACILITIES));
  const response = await api.getFacilities();
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

it('getMensaResource should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE_MENSA));
  const dateString = format(FIXED_DATE, 'YYYY-MM-DD');
  await api.getMensaResource('1', dateString);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`/catering/menuplans/years/`);
});
