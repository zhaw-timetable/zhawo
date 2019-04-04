import vszhawStore from './VsZhawStore';

import * as api from '../adapters/ZhawoAdapter';

it('handleActions should be defined', () => {
  expect(vszhawStore).toBeDefined();
  expect(vszhawStore.handleActions).toBeDefined();
});

it('should have the initial values', () => {
  expect(vszhawStore.feed).toEqual('');
});

it('handleActions with GET_VSZHAWFEED should update store', async () => {
  const restore = api.getVszhawFeed;
  api.getVszhawFeed = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve('newFeed');
    });
  });
  const ACTION = {
    type: 'GET_VSZHAWFEED'
  };
  expect(vszhawStore.feed).toEqual('');
  await vszhawStore.handleActions(ACTION);
  expect(vszhawStore.feed).toEqual('newFeed');
  vszhawStore.feed = '';
  api.getVszhawFeed = restore;
});

it('handleActions with GET_VSZHAWFEED should output error when Promise fails', async () => {
  const restore = api.getVszhawFeed;
  const restore2 = console.error;
  console.error = jest.fn();
  api.getVszhawFeed = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      throw new Error();
    });
  });
  const ACTION = {
    type: 'GET_VSZHAWFEED'
  };
  await vszhawStore.handleActions(ACTION);
  expect(console.error).toHaveBeenCalled();
  api.getVszhawFeed = restore;
  console.error = restore2;
});
