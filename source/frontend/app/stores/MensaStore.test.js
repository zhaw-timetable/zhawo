import { format } from 'date-fns';

import mensaStore from './MensaStore';

import * as api from '../adapters/ZhawoAdapter';

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

it('convertSunday should return Monday if Sunday is passed in', () => {
  const monday = new Date(2019, 2, 25);
  const sunday = new Date(2019, 2, 24);
  let returnValue = mensaStore.convertSunday(monday);
  expect(returnValue).toEqual(monday);
  returnValue = mensaStore.convertSunday(sunday);
  expect(returnValue).toEqual(monday);
});

it('handleActions with GET_ALL_MENSAS should call api.getAllMensas() and update store', async () => {
  const ACTION = {
    type: 'GET_ALL_MENSAS'
  };
  api.getAllMensas = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve(['mensa1', 'mensa2']);
    });
  });
  await mensaStore.handleActions(ACTION);
  expect(api.getAllMensas).toHaveBeenCalled();
  expect(mensaStore.allMensas).toEqual(['mensa1', 'mensa2']);
  api.getAllMensas.mockRestore();
});

it('handleActions with GET_MENUPLAN should and update store and call updateMenu with isNewFacility = true', async () => {
  const ACTION = {
    type: 'GET_MENUPLAN',
    payload: {
      facilityId: 23,
      facilityName: 'TestFacility'
    }
  };
  mensaStore.updateMenu = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve();
    });
  });
  await mensaStore.handleActions(ACTION);
  expect(mensaStore.updateMenu).toHaveBeenCalled();
  expect(mensaStore.updateMenu).toHaveBeenCalledWith(true);
  expect(mensaStore.selectedMensaId).toBe(23);
  expect(mensaStore.selectedMensaName).toEqual('TestFacility');
  mensaStore.updateMenu.mockRestore();
});

it('handleActions with MENU_GOTO_DAY should update store and call updateMenu', async () => {
  const date = new Date(2019, 2, 28);
  const ACTION = {
    type: 'MENU_GOTO_DAY',
    payload: date
  };
  mensaStore.convertSunday = jest.fn().mockReturnValue(date);
  mensaStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  mensaStore.updateMenu = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve();
    });
  });
  await mensaStore.handleActions(ACTION);
  expect(mensaStore.convertSunday).toHaveBeenCalled();
  expect(mensaStore.createDisplayWeek).toHaveBeenCalled();
  expect(mensaStore.updateMenu).toHaveBeenCalled();
  expect(mensaStore.updateMenu).toHaveBeenCalledWith(false);
  expect(mensaStore.displayDay).toEqual(date);
  expect(mensaStore.displayWeek).toEqual('displayWeek');
  mensaStore.convertSunday.mockRestore();
  mensaStore.createDisplayWeek.mockRestore();
  mensaStore.updateMenu.mockRestore();
});

it('handleActions with MENU_SWIPE_RIGHT should add 1 day to displayDay', () => {
  const date = new Date(2019, 2, 25);
  const datePlusOne = new Date(2019, 2, 26);
  mensaStore.displayDay = date;
  const ACTION = {
    type: 'MENU_SWIPE_RIGHT'
  };
  mensaStore.convertSunday = jest.fn().mockImplementation(date => date);
  mensaStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  mensaStore.handleActions(ACTION);
  expect(mensaStore.convertSunday).toHaveBeenCalled();
  expect(mensaStore.convertSunday).toHaveBeenCalledWith(datePlusOne);
  expect(mensaStore.createDisplayWeek).toHaveBeenCalled();
  expect(mensaStore.createDisplayWeek).toHaveBeenCalledWith(datePlusOne);
  mensaStore.convertSunday.mockRestore();
  mensaStore.createDisplayWeek.mockRestore();
});

it('handleActions with MENU_SWIPE_LEFT should subtract 1 day from displayDay', () => {
  const date = new Date(2019, 2, 28);
  const dateMinusOne = new Date(2019, 2, 27);
  mensaStore.displayDay = date;
  const ACTION = {
    type: 'MENU_SWIPE_LEFT'
  };
  mensaStore.convertSunday = jest.fn().mockImplementation(date => date);
  mensaStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  mensaStore.handleActions(ACTION);
  expect(mensaStore.convertSunday).toHaveBeenCalled();
  expect(mensaStore.convertSunday).toHaveBeenCalledWith(dateMinusOne);
  expect(mensaStore.createDisplayWeek).toHaveBeenCalled();
  expect(mensaStore.createDisplayWeek).toHaveBeenCalledWith(dateMinusOne);
  mensaStore.convertSunday.mockRestore();
  mensaStore.createDisplayWeek.mockRestore();
});

it('handleActions with MENU_SWIPE_LEFT should subtract 2 days from displayDay if displayDay is a monday', () => {
  const date = new Date(2019, 2, 25);
  const dateMinusTwo = new Date(2019, 2, 23);
  mensaStore.displayDay = date;
  const ACTION = {
    type: 'MENU_SWIPE_LEFT'
  };
  mensaStore.convertSunday = jest.fn().mockImplementation(date => date);
  mensaStore.createDisplayWeek = jest.fn().mockReturnValue('displayWeek');
  mensaStore.handleActions(ACTION);
  expect(mensaStore.convertSunday).toHaveBeenCalled();
  expect(mensaStore.convertSunday).toHaveBeenCalledWith(dateMinusTwo);
  expect(mensaStore.createDisplayWeek).toHaveBeenCalled();
  expect(mensaStore.createDisplayWeek).toHaveBeenCalledWith(dateMinusTwo);
  mensaStore.convertSunday.mockRestore();
  mensaStore.createDisplayWeek.mockRestore();
});
