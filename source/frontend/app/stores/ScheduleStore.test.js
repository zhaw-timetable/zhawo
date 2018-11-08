import scheduleStore from './ScheduleStore';

it('handleActions should be defined', () => {
  expect(scheduleStore).toBeDefined();
  expect(scheduleStore.handleActions).toBeDefined();
});
