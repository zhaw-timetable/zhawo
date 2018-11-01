import * as timetableActions from './TimetableActions';
import dispatcher from '../dispatcher.js';
import * as timetableAdapter from '../adapters/ZhawoAdapter';

const USERNAME = 'bachmdo2';
const STARTDATE = '2018-10-15';
const PAYLOAD = 'payload';
const DATE = new Date();

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
  console.log = jest.fn();
});

xit('import should be defined', () => {
  expect(timetableActions).toBeDefined();
});

xit('all actions should be defined', () => {
  expect(timetableActions.getTimetableByUsername).toBeDefined();
});

xit('getTimetableByUsername should dispatch correct type with payload when getting response', async () => {
  timetableAdapter.fetchByUsername = jest.fn(() => Promise.resolve(PAYLOAD));
  await timetableActions.getTimetableByUsername(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'GET_TIMETABLE_STARTED'
  });
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalled();
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalledWith(
    USERNAME,
    STARTDATE
  );
  expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(2, {
    type: 'GET_TIMETABLE_SUCCESS',
    payload: PAYLOAD
  });
});

xit('getTimetableByUsername should dispatch correct type when NOT getting response', async () => {
  timetableAdapter.fetchByUsername = jest.fn(() => Promise.resolve(null));
  await timetableActions.getTimetableByUsername(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'GET_TIMETABLE_STARTED'
  });
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalled();
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalledWith(
    USERNAME,
    STARTDATE
  );
  expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(2, {
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
