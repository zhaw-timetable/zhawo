import globalStore from './GlobalStore';

beforeEach(() => {
  console.log = jest.fn();
});

it('basic test', () => {
  expect(globalStore).toBeDefined();
  expect(globalStore.username).toBe('');
});
