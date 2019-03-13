import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import { format } from 'date-fns';

import dispatcher from '../dispatcher';

configure({ adapter: new Adapter() });

import mensaStore from './MensaStore';

it('handleActions should be defined', () => {
  expect(mensaStore).toBeDefined();
  expect(mensaStore.handleActions).toBeDefined();
});

it('should have the initial values', () => {
  expect(mensaStore.allMensas).toEqual([]);
  expect(mensaStore.selectedMensaName).toEqual('');
  expect(mensaStore.currentMenuPlan).toEqual(null);
  expect(mensaStore.currentMenuDay).toEqual(null);
  expect(format(mensaStore.currentDate, 'HH:MM DD')).toEqual(
    format(new Date(), 'HH:MM DD')
  );
});
