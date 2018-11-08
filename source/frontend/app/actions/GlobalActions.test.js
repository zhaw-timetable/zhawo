import * as globalActions from './GlobalActions';
import dispatcher from '../dispatcher.js';

jest.mock('../adapters/ZhawoAdapter');
jest.mock('../stores/GlobalStore');

const NAME = 'foo';
const TYPE = 'bar';

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
