import * as api from './CampusInfoAdapter';

beforeEach(() => {
  fetch.resetMocks();
  console.log = jest.fn();
});

const USERNAME = 'vissejul';
const STARTDATE = new Date();
const FETCH_RESPONSE = { foo: 'bar' };

xit('All functions shhould be exported', () => {
  expect(timetableAdapter).toBeDefined();
  expect(timetableAdapter.fetchByUsername).toBeDefined();
});

xit('Mocking of fetch calls should work', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await timetableAdapter.fetchByUsername(USERNAME, STARTDATE);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

xit('fetchByUsername should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await timetableAdapter.fetchByUsername(USERNAME, STARTDATE);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain('api/timetable/username');
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});
