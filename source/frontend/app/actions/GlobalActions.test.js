import * as globalActions from './GlobalActions';
import dispatcher from '../dispatcher.js';

const NAME = 'vissejul';

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
  console.log = jest.fn();
});

it('import should be defined', () => {
  expect(globalActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(globalActions.setUsername).toBeDefined();
});

it('setUsername should dispatch correct type with payload', () => {
  globalActions.setUsername(NAME);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'SET_USERNAME',
    payload: NAME
  });
});
