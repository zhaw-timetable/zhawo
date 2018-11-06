import globalStore from './GlobalStore';

beforeEach(() => {
  console.log = jest.fn();
});

it('test exports', () => {
  expect(globalStore).toBeDefined();
  expect(globalStore.currentUser).toBe('');
});
