import * as timetableActions from './TimetableActions';

it('basic test', () => {
  expect(timetableActions).toBeDefined();
  expect(timetableActions.getTimetableByUsername).toBeDefined();
});
