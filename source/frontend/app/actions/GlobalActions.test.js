import * as globalActions from './GlobalActions';
import dispatcher from '../dispatcher.js';

jest.mock('../stores/GlobalStore');

const NAME = 'foo';
const TYPE = 'bar';
const VALUE = 'dark';

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(globalActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(globalActions.setCurrentUser).toBeDefined();
  expect(globalActions.getPossibleNames).toBeDefined();
});

it('setUsername should dispatch correct type with payload', () => {
  globalActions.setCurrentUser(NAME, TYPE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'SET_CURRENT_USER',
    payload: { name: NAME, type: TYPE }
  });
});

it('toggleDrawer should dispatch correct type', () => {
  globalActions.toggleDrawer();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'TOGGLE_DRAWER'
  });
});

it('logout should dispatch correct type', () => {
  globalActions.logout();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'LOGOUT'
  });
});

it('changeTheme should dispatch correct type with payload', () => {
  globalActions.changeTheme(VALUE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'CHANGE_THEME',
    payload: VALUE
  });
});

it('setDayView should dispatch correct type with payload', () => {
  globalActions.setDayView(VALUE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'SET_DAYVIEW',
    payload: VALUE
  });
});
