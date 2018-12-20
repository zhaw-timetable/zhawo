import * as mensaActions from './MensaActions';
import dispatcher from '../dispatcher.js';

jest.mock('../stores/mensaStore');

const FACILITY_ID = '1';
const FACILITY_NAME = 'technikum';
const FIXED_DATE = new Date();

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(mensaActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(mensaActions.getAllMensas).toBeDefined();
  expect(mensaActions.getMenuPlan).toBeDefined();
});

it('getAllMensas should dispatch correct type', () => {
  mensaActions.getAllMensas();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_ALL_MENSAS'
  });
});

it('getMenuPlan should dispatch correct type with payload', () => {
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
