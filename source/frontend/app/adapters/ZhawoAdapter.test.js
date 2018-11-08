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

it('Mocking of fetch calls should work', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await api.getScheduleResource(ROUTE, NAME, STARTDATE, 0);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

it('getScheduleResource should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await api.getScheduleResource(ROUTE, NAME, STARTDATE, 0);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/schedules/${ROUTE}`);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});
