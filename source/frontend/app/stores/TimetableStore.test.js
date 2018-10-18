import timetableStore from './TimetableStore';

it('basic test', () => {
  expect(timetableStore).toBeDefined();
  expect(timetableStore.handleActions).toBeDefined();
});
