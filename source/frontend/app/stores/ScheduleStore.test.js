import scheduleStore from './ScheduleStore';

it('basic test', () => {
  expect(scheduleStore).toBeDefined();
  expect(scheduleStore.handleActions).toBeDefined();
});
