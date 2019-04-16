import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import { format } from 'date-fns';

import dispatcher from '../dispatcher';

configure({ adapter: new Adapter() });

import roomSearchStore from './RoomSearchStore';

it('handleActions should be defined', () => {
  expect(roomSearchStore).toBeDefined();
  expect(roomSearchStore.handleActions).toBeDefined();
});

it('should have the initial values', () => {
  expect(roomSearchStore.freeRooms).toEqual([]);
  expect(roomSearchStore.startTime).toEqual('');
  expect(roomSearchStore.endTime).toEqual('');
  expect(roomSearchStore.currentfreeRooms).toEqual([]);
});
