import timetableStore from './TimetableStore';

beforeEach(() => {
  console.log = jest.fn();
});

it('basic test', () => {
  expect(timetableStore).toBeDefined();
  expect(timetableStore.handleActions).toBeDefined();
});
