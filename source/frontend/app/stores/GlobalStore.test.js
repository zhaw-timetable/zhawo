import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import dispatcher from '../dispatcher';

configure({ adapter: new Adapter() });

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
