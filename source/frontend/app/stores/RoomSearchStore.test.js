import roomSearchStore from './RoomSearchStore';

it('handleActions should be defined', () => {
  expect(roomSearchStore).toBeDefined();
  expect(roomSearchStore.handleActions).toBeDefined();
});
