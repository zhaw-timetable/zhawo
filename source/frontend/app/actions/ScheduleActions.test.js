jest.mock('../adapters/ZhawoAdapter');
jest.mock('../adapters/IdbAdapter');
jest.mock('../stores/GlobalStore');

import * as scheduleActions from './ScheduleActions';
import dispatcher from '../dispatcher.js';

import globalStore from '../stores/GlobalStore';

const ROUTE = 'route';
const NAME = 'foobar';
const STARTDATE = '2018-10-15';
const DATE = new Date();

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(scheduleActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(scheduleActions.getSchedule).toBeDefined();
  expect(scheduleActions.gotoDay).toBeDefined();
  expect(scheduleActions.clearSearch).toBeDefined();
});

it('getSchedule should dispatch correct type for same user as in store', () => {
  globalStore.currentUser = NAME;
  scheduleActions.getSchedule(ROUTE, NAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_SCHEDULE_FOR_USER',
    payload: { route: ROUTE, name: NAME, startDate: STARTDATE }
  });
});

it('getSchedule should dispatch correct type for different user as in store', () => {
  globalStore.currentUser = 'some other name';
  scheduleActions.getSchedule(ROUTE, NAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_SCHEDULE_FOR_SEARCH',
    payload: { route: ROUTE, name: NAME, startDate: STARTDATE }
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

it('clearSearch should dispatch correct type', () => {
  scheduleActions.clearSearch();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'CLEAR_SEARCH'
  });
});
