import globalStore from './GlobalStore';

it('basic test', () => {
  expect(globalStore).toBeDefined();
  expect(globalStore.name).toBe('Hello World');
});
