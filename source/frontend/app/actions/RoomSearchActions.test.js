import * as roomsearchActions from './RoomSearchActions';
import dispatcher from '../dispatcher.js';

jest.mock('../stores/RoomSearchStore');

const VALUE = 'value';

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(roomsearchActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(roomsearchActions.getFreeRoomsJson).toBeDefined();
  expect(roomsearchActions.getFreeRoomsByTime).toBeDefined();
});

it('getFreeRoomsJson should dispatch correct type', () => {
  roomsearchActions.getFreeRoomsJson();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_FREEROOMJSON'
  });
});

it('getFreeRoomsByTime should dispatch correct type with payload', () => {
  roomsearchActions.getFreeRoomsByTime(VALUE);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_FREEROOMBYTIME',
    payload: VALUE
  });
});
