jest.mock('idb');

import idb from 'idb';

import * as idbAdapter from './IdbAdapter';

it('idbAdapter should be defined', () => {
  expect(idbAdapter).toBeDefined();
});
