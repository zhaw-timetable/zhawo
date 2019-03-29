jest.mock('./GlobalStore');
jest.mock('../adapters/IdbAdapter');

import globalStore from './GlobalStore';
import scheduleStore from './ScheduleStore';

import * as api from '../adapters/ZhawoAdapter';

it('handleActions should be defined', () => {
  expect(scheduleStore).toBeDefined();
  expect(scheduleStore.handleActions).toBeDefined();
});

it('initializeStore should initialize store', () => {
  scheduleStore.createDisplayWeek = jest.fn();
  scheduleStore.createDisplayMonth = jest.fn();
  scheduleStore.getCurrentDate = jest.fn();
  scheduleStore.initializeStore();
  expect(scheduleStore.currentAction).toEqual('');
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalled();
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalled();
  expect(scheduleStore.getCurrentDate).toHaveBeenCalled();
  expect(scheduleStore.slots).toBeDefined();
  expect(scheduleStore.currentSearch).toEqual('');
  expect(scheduleStore.schedule).toBe(null);
  expect(scheduleStore.scheduleForCurrentUser).toBe(null);
  expect(scheduleStore.scheduleForSearchUser).toBe(null);
  scheduleStore.createDisplayWeek.mockRestore();
  scheduleStore.createDisplayMonth.mockRestore();
  scheduleStore.getCurrentDate.mockRestore();
});

it('clearStore should reset store to initial values', () => {
  scheduleStore.schedule = 'something';
  scheduleStore.scheduleForCurrentUser = 'something';
  scheduleStore.scheduleForSearchUser = 'something';
  scheduleStore.displayDay = 'something';
  scheduleStore.currentSearch = 'some search';
  scheduleStore.currentAction = 'some action';
  scheduleStore.clearStore();
  expect(scheduleStore.schedule).toBe(null);
  expect(scheduleStore.scheduleForCurrentUser).toBe(null);
  expect(scheduleStore.scheduleForSearchUser).toBe(null);
  expect(scheduleStore.displayDay).toEqual(scheduleStore.currentDate);
  expect(scheduleStore.currentSearch).toEqual('');
  expect(scheduleStore.currentAction).toEqual('');
});

it('convertSunday should return Monday if Sunday is passed in', () => {
  const monday = new Date(2019, 2, 25);
  const sunday = new Date(2019, 2, 24);
  let returnValue = scheduleStore.convertSunday(monday);
  expect(returnValue).toEqual(monday);
  returnValue = scheduleStore.convertSunday(sunday);
  expect(returnValue).toEqual(monday);
});

it('handleActions with GOTO_DAY should call update displayDay, createDisplayWeek and createDisplayMonth', () => {
  const date = new Date(2019, 2, 25);
  const ACTION = {
    type: 'GOTO_DAY',
    payload: date
  };
  scheduleStore.convertSunday = jest.fn().mockReturnValue(date);
  scheduleStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  scheduleStore.createDisplayMonth = jest.fn().mockReturnValue('displayMonth');
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.convertSunday).toHaveBeenCalled();
  expect(scheduleStore.convertSunday).toHaveBeenCalledWith(date);
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalled();
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalledWith(date);
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalled();
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalledWith(date);
  expect(scheduleStore.displayDay).toEqual(date);
  expect(scheduleStore.displayWeek).toEqual('displayWeek');
  expect(scheduleStore.displayMonth).toEqual('displayMonth');
  scheduleStore.convertSunday.mockRestore();
  scheduleStore.createDisplayWeek.mockRestore();
  scheduleStore.createDisplayMonth.mockRestore();
});

it('handleActions with CLEAR_SEARCH should set schedule to scheduleForCurrentUser and clear currentSearch', () => {
  const ACTION = {
    type: 'CLEAR_SEARCH'
  };
  scheduleStore.schedule = 'scheduleBefore';
  scheduleStore.scheduleForCurrentUser = 'expectedSchedule';
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.schedule).toEqual('expectedSchedule');
  expect(scheduleStore.scheduleForCurrentUser).toEqual('expectedSchedule');
  expect(scheduleStore.currentSearch).toEqual('');
});

it('handleActions with LOGOUT should call clearStore', () => {
  const ACTION = {
    type: 'LOGOUT'
  };
  scheduleStore.clearStore = jest.fn();
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.clearStore).toHaveBeenCalled();
  scheduleStore.clearStore.mockRestore();
});

it('handleActions with SWIPE_RIGHT should add 1 day to displayDay if globalStore.isDayView is true', () => {
  const date = new Date(2019, 2, 25);
  const datePlusOne = new Date(2019, 2, 26);
  globalStore.isDayView = true;
  scheduleStore.displayDay = date;
  const ACTION = {
    type: 'SWIPE_RIGHT'
  };
  scheduleStore.convertSunday = jest.fn().mockImplementation(date => date);
  scheduleStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  scheduleStore.createDisplayMonth = jest.fn().mockReturnValue('displayMonth');
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.convertSunday).toHaveBeenCalled();
  expect(scheduleStore.convertSunday).toHaveBeenCalledWith(datePlusOne);
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalled();
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalledWith(datePlusOne);
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalled();
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalledWith(datePlusOne);
  scheduleStore.convertSunday.mockRestore();
  scheduleStore.createDisplayWeek.mockRestore();
  scheduleStore.createDisplayMonth.mockRestore();
});

it('handleActions with SWIPE_RIGHT should add 7 days to displayDay if globalStore.isDayView is false', () => {
  const date = new Date(2019, 2, 25);
  const datePlusOneWeek = new Date(2019, 3, 1);
  globalStore.isDayView = false;
  scheduleStore.displayDay = date;
  const ACTION = {
    type: 'SWIPE_RIGHT'
  };
  scheduleStore.convertSunday = jest.fn().mockImplementation(date => date);
  scheduleStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  scheduleStore.createDisplayMonth = jest.fn().mockReturnValue('displayMonth');
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.convertSunday).toHaveBeenCalled();
  expect(scheduleStore.convertSunday).toHaveBeenCalledWith(datePlusOneWeek);
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalled();
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalledWith(datePlusOneWeek);
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalled();
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalledWith(
    datePlusOneWeek
  );
  scheduleStore.convertSunday.mockRestore();
  scheduleStore.createDisplayWeek.mockRestore();
  scheduleStore.createDisplayMonth.mockRestore();
});

it('handleActions with SWIPE_LEFT should subtract 1 day from displayDay if globalStore.isDayView is true', () => {
  const date = new Date(2019, 2, 28);
  const dateMinusOne = new Date(2019, 2, 27);
  globalStore.isDayView = true;
  scheduleStore.displayDay = date;
  const ACTION = {
    type: 'SWIPE_LEFT'
  };
  scheduleStore.convertSunday = jest.fn().mockImplementation(date => date);
  scheduleStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  scheduleStore.createDisplayMonth = jest.fn().mockReturnValue('displayMonth');
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.convertSunday).toHaveBeenCalled();
  expect(scheduleStore.convertSunday).toHaveBeenCalledWith(dateMinusOne);
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalled();
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalledWith(dateMinusOne);
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalled();
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalledWith(dateMinusOne);
  scheduleStore.convertSunday.mockRestore();
  scheduleStore.createDisplayWeek.mockRestore();
  scheduleStore.createDisplayMonth.mockRestore();
});

it('handleActions with SWIPE_LEFT should subtract 2 days from displayDay if globalStore.isDayView is true and displayDay is a monday', () => {
  const date = new Date(2019, 2, 25);
  const dateMinusTwo = new Date(2019, 2, 23);
  globalStore.isDayView = true;
  scheduleStore.displayDay = date;
  const ACTION = {
    type: 'SWIPE_LEFT'
  };
  scheduleStore.convertSunday = jest.fn().mockImplementation(date => date);
  scheduleStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  scheduleStore.createDisplayMonth = jest.fn().mockReturnValue('displayMonth');
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.convertSunday).toHaveBeenCalled();
  expect(scheduleStore.convertSunday).toHaveBeenCalledWith(dateMinusTwo);
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalled();
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalledWith(dateMinusTwo);
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalled();
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalledWith(dateMinusTwo);
  scheduleStore.convertSunday.mockRestore();
  scheduleStore.createDisplayWeek.mockRestore();
  scheduleStore.createDisplayMonth.mockRestore();
});

it('handleActions with SWIPE_RIGHT should subtract 7 days from displayDay if globalStore.isDayView is false', () => {
  const date = new Date(2019, 2, 28);
  const dateMinusOneWeek = new Date(2019, 2, 21);
  globalStore.isDayView = false;
  scheduleStore.displayDay = date;
  const ACTION = {
    type: 'SWIPE_LEFT'
  };
  scheduleStore.convertSunday = jest.fn().mockImplementation(date => date);
  scheduleStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  scheduleStore.createDisplayMonth = jest.fn().mockReturnValue('displayMonth');
  scheduleStore.handleActions(ACTION);
  expect(scheduleStore.convertSunday).toHaveBeenCalled();
  expect(scheduleStore.convertSunday).toHaveBeenCalledWith(dateMinusOneWeek);
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalled();
  expect(scheduleStore.createDisplayWeek).toHaveBeenCalledWith(
    dateMinusOneWeek
  );
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalled();
  expect(scheduleStore.createDisplayMonth).toHaveBeenCalledWith(
    dateMinusOneWeek
  );
  scheduleStore.convertSunday.mockRestore();
  scheduleStore.createDisplayWeek.mockRestore();
  scheduleStore.createDisplayMonth.mockRestore();
});

it('handleActions with GET_SCHEDULE_FOR_USER should update store with schedules from api', async () => {
  globalStore.currentUser = 'maxmuster';
  scheduleStore.schedule = null;
  scheduleStore.scheduleForCurrentUser = null;
  scheduleStore.scheduleForSearchUser = null;
  const date = new Date(2019, 2, 28);
  const ACTION = {
    type: 'GET_SCHEDULE_FOR_USER',
    payload: {
      route: 'students',
      name: 'maxmuster',
      startDate: date
    }
  };
  let counter = 0;
  api.getScheduleResource = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve({ weeks: { [counter++]: 'week' } });
    });
  });
  await scheduleStore.handleActions(ACTION);
  expect(api.getScheduleResource).toHaveBeenCalled();
  expect(api.getScheduleResource).toHaveBeenCalledWith(
    'students',
    'maxmuster',
    date,
    0
  );
  expect(scheduleStore.scheduleForSearchUser).toBe(null);
  expect(Object.keys(scheduleStore.scheduleForCurrentUser.weeks).length).toBe(
    27
  );
  expect(Object.keys(scheduleStore.schedule.weeks).length).toBe(27);
  api.getScheduleResource.mockRestore();
});

it('handleActions with GET_SCHEDULE_FOR_SEARCH should update store with schedules from api', async () => {
  globalStore.currentUser = 'maxmuster';
  scheduleStore.schedule = null;
  scheduleStore.scheduleForCurrentUser = null;
  scheduleStore.scheduleForSearchUser = null;
  const date = new Date(2019, 2, 28);
  const ACTION = {
    type: 'GET_SCHEDULE_FOR_SEARCH',
    payload: {
      route: 'students',
      name: 'someoneelse',
      startDate: date
    }
  };
  let counter = 0;
  api.getScheduleResource = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve({ weeks: { [counter++]: 'week' } });
    });
  });
  await scheduleStore.handleActions(ACTION);
  expect(api.getScheduleResource).toHaveBeenCalled();
  expect(api.getScheduleResource).toHaveBeenCalledWith(
    'students',
    'someoneelse',
    date,
    0
  );
  expect(scheduleStore.scheduleForCurrentUser).toBe(null);
  expect(Object.keys(scheduleStore.scheduleForSearchUser.weeks).length).toBe(
    27
  );
  expect(Object.keys(scheduleStore.schedule.weeks).length).toBe(27);
  api.getScheduleResource.mockRestore();
});

it('handleActions with GET_SCHEDULE_FOR_SEARCH should break if currentAction equals action.type', async () => {
  globalStore.currentUser = 'maxmuster';
  scheduleStore.currentAction = 'GET_SCHEDULE_FOR_SEARCH';
  scheduleStore.schedule = null;
  scheduleStore.scheduleForCurrentUser = null;
  scheduleStore.scheduleForSearchUser = null;
  const date = new Date(2019, 2, 28);
  const ACTION = {
    type: 'GET_SCHEDULE_FOR_SEARCH',
    payload: {
      route: 'students',
      name: 'someoneelse',
      startDate: date
    }
  };
  let counter = 0;
  api.getScheduleResource = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve({ weeks: { [counter++]: 'week' } });
    });
  });
  await scheduleStore.handleActions(ACTION);
  expect(api.getScheduleResource).not.toHaveBeenCalled();
  expect(scheduleStore.scheduleForCurrentUser).toBe(null);
  expect(scheduleStore.scheduleForSearchUser).toBe(null);
  expect(scheduleStore.schedule).toBe(null);
  api.getScheduleResource.mockRestore();
});
