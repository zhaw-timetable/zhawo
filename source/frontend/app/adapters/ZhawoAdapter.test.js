import * as api from './ZhawoAdapter';

beforeEach(() => {
  fetch.resetMocks();
});

const ROUTE = 'route';
const NAME = 'foobar';
const STARTDATE = new Date();
const FETCH_RESPONSE = { foo: 'bar' };

it('All functions should be exported', () => {
  expect(api).toBeDefined();
  expect(api.getScheduleResource).toBeDefined();
  expect(api.getPossibleNames).toBeDefined();
});

it('getScheduleResource should call fetch give default value on empty', async () => {
  fetch.once(JSON.stringify(false));
  const response = await api.getScheduleResource(ROUTE, NAME, STARTDATE, 0);
  expect(fetch).toHaveBeenCalled();
  expect(response).toBeDefined();
  expect(response).toEqual({ weeks: {} });
});

it('getScheduleResource should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(false));
  const response = await api.getScheduleResource(ROUTE, NAME, STARTDATE, 0);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/schedules/${ROUTE}`);
  expect(response).toBeDefined();
  expect(response).toEqual({ weeks: {} });
});

it('getMensaResource should call correct api endpoint', async () => {
  const fetchResponse = ['value'];
  fetch.once(JSON.stringify(fetchResponse));
  const response = await api.getMensaResource('1', STARTDATE);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/mensa/menus/1?`);
  expect(response).toBeDefined();
  expect(response).toEqual('value');
});

it('getAllMensas should call correct api endpoint', async () => {
  fetch.once(JSON.stringify([1, 2, 3, 4]));
  const response = await api.getAllMensas();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/mensa`);
  expect(response).toBeDefined();
  expect(response).toEqual([3, 4]);
});

it('getVszhawFeed should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await api.getVszhawFeed();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/vszhaw`);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

it('handleError should log error information', () => {
  const restore = console.log;
  console.log = jest.fn();
  api.handleError('error', 'url');
  expect(console.log).toHaveBeenCalled();
  expect(console.log.mock.calls[0][0]).toContain(`error`);
  console.log = restore;
});
