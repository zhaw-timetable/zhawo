import * as roomsearchActions from './RoomSearchActions';
import dispatcher from '../dispatcher.js';

jest.mock('../stores/RoomSearchStore');

beforeEach(() => {
  dispatcher.dispatch = jest.fn();
});

it('import should be defined', () => {
  expect(roomsearchActions).toBeDefined();
});

it('all actions should be defined', () => {
  expect(roomsearchActions.fetchFreeRoomData).toBeDefined();
  expect(roomsearchActions.getFreeRoomsByTime).toBeDefined();
  expect(roomsearchActions.changeFloor).toBeDefined();
});

it('fetchFreeRoomData should dispatch correct type', () => {
  roomsearchActions.fetchFreeRoomData();
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'FETCH_FREE_ROOM_DATA'
  });
});

it('getFreeRoomsByTime should dispatch correct type with payload', () => {
  const START_TIME = 'startTime';
  const END_TIME = 'endTime';
  roomsearchActions.getFreeRoomsByTime(START_TIME, END_TIME);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'GET_FREE_ROOMS_BY_TIME',
    payload: { startTime: START_TIME, endTime: END_TIME }
  });
});

it('changeFloor should dispatch correct type with payload', () => {
  const SELECTED_FLOOR = 'floor';
  roomsearchActions.changeFloor(SELECTED_FLOOR);
  expect(dispatcher.dispatch).toHaveBeenCalled();
  expect(dispatcher.dispatch).toHaveBeenCalledWith({
    type: 'CHANGE_FLOOR',
    payload: SELECTED_FLOOR
  });
});
