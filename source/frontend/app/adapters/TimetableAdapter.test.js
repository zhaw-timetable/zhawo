import * as timetableAdapter from './TimetableAdapter';

it('basic test', () => {
  expect(timetableAdapter).toBeDefined();
  expect(timetableAdapter.fetchByUsername).toBeDefined();
});
