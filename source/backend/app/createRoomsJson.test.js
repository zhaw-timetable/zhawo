import * as createRooms from './createRoomsJson';

it('all exports should be defined', () => {
  expect(createRooms).toBeDefined();
  expect(createRooms.createFreeRoomsJson).toBeDefined();
});

it('should create Free Rooms Json file createFreeRoomsJson', () => {
  createRooms.createFreeRoomsObject = jest.fn();
});
