import * as vszhawActions from './VsZhawActions';
import dispatcher from '../dispatcher.js';

jest.mock('../stores/VsZhawStore');

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(vszhawActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(vszhawActions.getVszhawFeed).toBeDefined();
});

it('getVszhawFeed should dispatch correct type', () => {
  vszhawActions.getVszhawFeed();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_VSZHAWFEED'
  });
});
