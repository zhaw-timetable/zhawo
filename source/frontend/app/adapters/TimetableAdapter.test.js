import * as timetableAdapter from './TimetableAdapter';

beforeEach(() => {
  console.log = jest.fn();
});

it('basic test', () => {
  expect(timetableAdapter).toBeDefined();
  expect(timetableAdapter.fetchByUsername).toBeDefined();
});
