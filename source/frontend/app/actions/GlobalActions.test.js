import * as globalActions from './GlobalActions';

it('basic test', () => {
  expect(globalActions).toBeDefined();
  expect(globalActions.setName).toBeDefined();
});
