import * as scheduleActions from './ScheduleActions';
import dispatcher from '../dispatcher.js';
import * as api from '../adapters/ZhawoAdapter';

const USERNAME = 'bachmdo2';
const STARTDATE = '2018-10-15';
const PAYLOAD = 'payload';
const DATE = new Date();

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
  console.log = jest.fn();
});

xit('import should be defined', () => {
  expect(scheduleActions).toBeDefined();
});

xit('all actions should be defined', () => {
  expect(scheduleActions.getScheduleByUsername).toBeDefined();
});

xit('getScheduleByUsername should dispatch correct type with payload when getting response', async () => {
  api.fetchByUsername = jest.fn(() => Promise.resolve(PAYLOAD));
  await scheduleActions.getScheduleByUsername(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'GET_Schedule_STARTED'
  });
  expect(api.fetchByUsername).toHaveBeenCalled();
  expect(api.fetchByUsername).toHaveBeenCalledWith(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(2, {
    type: 'GET_Schedule_SUCCESS',
    payload: PAYLOAD
  });
});

xit('getScheduleByUsername should dispatch correct type when NOT getting response', async () => {
  api.fetchByUsername = jest.fn(() => Promise.resolve(null));
  await scheduleActions.getScheduleByUsername(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'GET_Schedule_STARTED'
  });
  expect(api.fetchByUsername).toHaveBeenCalled();
  expect(api.fetchByUsername).toHaveBeenCalledWith(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(2, {
    type: 'GET_Schedule_FAIL'
  });
});

it('gotoDay should dispatch correct type with payload', () => {
  scheduleActions.gotoDay(DATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GOTO_DAY',
    payload: DATE
  });
});
