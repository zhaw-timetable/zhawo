import * as mensaActions from './MensaActions';
import dispatcher from '../dispatcher.js';

jest.mock('../stores/MensaStore');

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(mensaActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(mensaActions.getAllMensas).toBeDefined();
  expect(mensaActions.getMenuPlan).toBeDefined();
  expect(mensaActions.swipeRight).toBeDefined();
  expect(mensaActions.swipeLeft).toBeDefined();
  expect(mensaActions.gotoDay).toBeDefined();
});

it('getAllMensas should dispatch correct type', () => {
  mensaActions.getAllMensas();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_ALL_MENSAS'
  });
});

it('getMenuPlan should dispatch correct type with payload', () => {
  const FACILITY_ID = '1';
  const FACILITY_NAME = 'technikum';
  const FIXED_DATE = 'date';
  mensaActions.getMenuPlan(FACILITY_ID, FACILITY_NAME, FIXED_DATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_MENUPLAN',
    payload: {
      facilityId: FACILITY_ID,
      facilityName: FACILITY_NAME,
      date: FIXED_DATE
    }
  });
});

it('swipeRight should dispatch correct type', () => {
  mensaActions.swipeRight();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'MENU_SWIPE_RIGHT'
  });
});

it('swipeLeft should dispatch correct type', () => {
  mensaActions.swipeLeft();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'MENU_SWIPE_LEFT'
  });
});

it('gotoDay should dispatch correct type with payload', () => {
  const TARGET_DATE = 'target_date';
  mensaActions.gotoDay(TARGET_DATE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'MENU_GOTO_DAY',
    payload: TARGET_DATE
  });
});
