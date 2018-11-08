import * as scheduleActions from './ScheduleActions';
import dispatcher from '../dispatcher.js';
import * as api from '../adapters/ZhawoAdapter';

jest.mock('../adapters/ZhawoAdapter');

const ROUTE = 'route';
const NAME = 'foobar';
const STARTDATE = '2018-10-15';
const PAYLOAD = 'payload';
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

it('getSchedule should dispatch correct type with payload when getting response', async () => {
  api.getScheduleResource = jest.fn(() => Promise.resolve(PAYLOAD));
  await scheduleActions.getSchedule(ROUTE, NAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(api.getScheduleResource).toHaveBeenCalled();
});

it('gotoDay should dispatch correct type with payload', () => {
  scheduleActions.gotoDay(DATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GOTO_DAY',
    payload: DATE
  });
});
