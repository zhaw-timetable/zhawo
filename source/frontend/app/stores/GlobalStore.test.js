jest.mock('idb');

import dispatcher from '../dispatcher';
import globalStore from './GlobalStore';

it('handleActions should be defined', () => {
  expect(globalStore).toBeDefined();
  expect(globalStore.handleActions).toBeDefined();
});

it('should have the initial values', () => {
  expect(globalStore.theme).toEqual('lightTheme');
  expect(globalStore.currentUser).toEqual('');
  expect(globalStore.currentUserType).toEqual('');
  expect(globalStore.possibleNames).toEqual([]);
  expect(globalStore.possibleLoginNames).toEqual([]);
  expect(globalStore.drawerOpen).toEqual(false);
  expect(globalStore.isDayView).toEqual(true);
});

it('should call setState with the correct value via setFeed', () => {
  globalStore.setThemeInDB = jest.fn();

  globalStore.setTheme(true);

  expect(globalStore.theme).toEqual('darkTheme');
  expect(globalStore.setThemeInDB).toHaveBeenCalledWith('darkTheme');
});
