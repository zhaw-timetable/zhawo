import globalStore from './GlobalStore';

it('handleActions should be defined', () => {
  expect(globalStore).toBeDefined();
  expect(globalStore.handleActions).toBeDefined();
});
