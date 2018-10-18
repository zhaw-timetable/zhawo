import * as globalActions from './GlobalActions';
import dispatcher from '../dispatcher.js';

const NAME = 'justmejulian';

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(globalActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(globalActions.setName).toBeDefined();
});

it('setName should dispatch correct type with payload', () => {
  globalActions.setName(NAME);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'SET_NAME',
    payload: NAME
  });
});
