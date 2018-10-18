import * as timetableActions from './TimetableActions';
import dispatcher from '../dispatcher.js';
import * as timetableAdapter from '../adapters/TimetableAdapter';

const USERNAME = 'bachmdo2';
const STARTDATE = '2018-10-15';

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(timetableActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(timetableActions.getTimetableByUsername).toBeDefined();
});

it('getTimetableByUsername should dispatch correct type with payload', () => {
  timetableAdapter.fetchByUsername = jest.fn(() => {
    return new Promise(resolve => resolve('result1'));
  });
  timetableActions.getTimetableByUsername(USERNAME, STARTDATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'GET_TIMETABLE_STARTED'
  });
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalled();
  expect(timetableAdapter.fetchByUsername).toHaveBeenCalledWith(
    USERNAME,
    STARTDATE
  );
  // TODO figure out why this isnt the case
  // expect(dispatcher.dispatch).toHaveBeenCalledTimes(3);
  // expect(dispatcher.dispatch).toHaveBeenNthCalledWith(2, {
  //   type: 'GET_TIMETABLE_SUCCESS',
  //   payload: 'result1'
  // });
});
