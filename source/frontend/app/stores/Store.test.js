import store from './Store';

it('basic test', () => {
  expect(store).toBeDefined();
  expect(store.name).toBe('Hello World');
});
