import * as timetableActions from './TimetableActions';
import dispatcher from '../dispatcher.js';
import * as timetableAdapter from '../adapters/TimetableAdapter';

const USERNAME = 'bachmdo2';
const STARTDATE = '2018-10-15';
const PAYLOAD = 'payload';
const DATE = new Date();

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
  console.log = jest.fn();
});

it('import should be defined', () => {
  expect(timetableActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(timetableActions.getTimetableByUsername).toBeDefined();
});

it('getTimetableByUsername should dispatch correct type with payload when getting response', async () => {
  timetableAdapter.fetchByUsername = jest.fn(() => Promise.resolve(PAYLOAD));
  await timetableActions.getTimetableByUsername(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalled();
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalledWith(
    USERNAME,
    STARTDATE
  );
  expect(dispatcher.dispatch).toHaveBeenCalledTimes(1);
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'GET_TIMETABLE_SUCCESS',
    payload: PAYLOAD
  });
});

it('getTimetableByUsername should dispatch correct type when NOT getting response', async () => {
  timetableAdapter.fetchByUsername = jest.fn(() => Promise.resolve(null));
  await timetableActions.getTimetableByUsername(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalled();
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalledWith(
    USERNAME,
    STARTDATE
  );
  expect(dispatcher.dispatch).toHaveBeenCalledTimes(1);
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'GET_TIMETABLE_FAIL'
  });
});

it('gotoDay should dispatch correct type with payload', () => {
  timetableActions.gotoDay(DATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GOTO_DAY',
    payload: DATE
  });
});
