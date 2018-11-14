import * as scheduleActions from './ScheduleActions';
import dispatcher from '../dispatcher.js';

jest.mock('../adapters/ZhawoAdapter');

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

it('getSchedule should dispatch correct type', () => {
  scheduleActions.getSchedule(ROUTE, NAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
});

it('gotoDay should dispatch correct type with payload', () => {
  scheduleActions.gotoDay(DATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GOTO_DAY',
    payload: DATE
  });
});
