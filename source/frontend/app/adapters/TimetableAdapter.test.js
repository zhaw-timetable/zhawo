import * as timetableAdapter from './TimetableAdapter';

beforeEach(() => {
  fetch.resetMocks();
  console.log = jest.fn();
});

const USERNAME = 'vissejul';
const STARTDATE = new Date();
const FETCH_RESPONSE = { foo: 'bar' };

it('All functions shhould be exported', () => {
  expect(timetableAdapter).toBeDefined();
  expect(timetableAdapter.fetchByUsername).toBeDefined();
});

it('Mocking of fetch calls should work', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await timetableAdapter.fetchByUsername(USERNAME, STARTDATE);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

it('fetchByUsername should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await timetableAdapter.fetchByUsername(USERNAME, STARTDATE);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain('api/timetable/username');
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});
