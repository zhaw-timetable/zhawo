jest.mock('../adapters/IdbAdapter');

import roomSearchStore from './RoomSearchStore';
import * as api from '../adapters/ZhawoAdapter';

it('handleActions should be defined', () => {
  expect(roomSearchStore).toBeDefined();
  expect(roomSearchStore.handleActions).toBeDefined();
});

it('should return time slots between given time', () => {
  let endTime = '2018-10-29T09:35:00+01:00';
  let startTime = '2018-10-29T08:00:00+01:00';

  roomSearchStore.allRooms = [
    {
      slot: {
        endTime: '2018-10-29T08:45:00+01:00',
        startTime: '2018-10-29T08:00:00+01:00',
        rooms: ['TE200', 'TE14']
      }
    },
    {
      slot: {
        endTime: '2018-10-29T09:35:00+01:00',
        startTime: '2018-10-29T08:50:00+01:00',
        rooms: ['TE200', 'TE14']
      }
    },
    {
      slot: {
        endTime: '2018-10-29T10:45:00+01:00',
        tartTime: '2018-10-29T10:00:00+01:00',
        rooms: ['TE200', 'TE14']
      }
    }
  ];

  let tempSlots = roomSearchStore.getTimeSlotsBetweenTimes(startTime, endTime);
  expect(tempSlots).toEqual([0, 1]);
});

it('should get all the floor of a building', () => {
  let temp = roomSearchStore.getBuildingFloors('TB');

  expect(temp).toEqual(['TB2', 'TB3', 'TB4', 'TB5', 'TB6']);
});

it('should call api getFreeRoomsJson from fetchFreeRoomData if no rooms yet', () => {
  roomSearchStore.allRooms = [];
  api.getFreeRoomsJson = jest.fn();

  roomSearchStore.fetchFreeRoomData();
  expect(api.getFreeRoomsJson).toHaveBeenCalled();

  roomSearchStore.allRooms = ['test', 'test'];
  api.getFreeRoomsJson = jest.fn();

  roomSearchStore.fetchFreeRoomData();
  expect(api.getFreeRoomsJson).not.toHaveBeenCalled();
});

it('should call return free rooms for 2 given times ', () => {
  let endTime = '2018-10-29T10:45:00+01:00';
  let startTime = '2018-10-29T08:00:00+01:00';

  roomSearchStore.allRooms = [
    { rooms: ['TE200', 'TE14'] },
    { rooms: ['TE200', 'TE14'] },
    { rooms: ['TE200', 'TE14'] },
    { rooms: ['TE200', 'TE14'] },
    { rooms: ['TE200', 'TE14'] }
  ];

  roomSearchStore.getTimeSlotsBetweenTimes = jest
    .fn()
    .mockReturnValue([0, 1, 2]);
  let tempFreeRooms = roomSearchStore.getCurrentFreeRooms(startTime, endTime);

  expect(tempFreeRooms).toEqual(['TE200', 'TE14']);
});

it('should return the common element of 2 arrays', () => {
  let temp = roomSearchStore.getCommonElements([1, 2, 3], [2, 3, 4]);
  expect(temp).toEqual([2, 3]);
});

it('handleActions start right functions', () => {
  roomSearchStore.fetchFreeRoomData = jest.fn();
  roomSearchStore.getCurrentFreeRooms = jest.fn();
  roomSearchStore.getBuildingFloors = jest.fn();

  let action = {
    type: 'FETCH_FREE_ROOM_DATA'
  };
  roomSearchStore.handleActions(action);
  expect(roomSearchStore.fetchFreeRoomData).toHaveBeenCalled();

  action = {
    type: 'GET_FREE_ROOMS_BY_TIME',
    payload: {
      endTime: '2018-10-29T08:45:00+01:00',
      startTime: '2018-10-29T08:00:00+01:00'
    }
  };
  roomSearchStore.handleActions(action);
  expect(roomSearchStore.getCurrentFreeRooms).toHaveBeenCalled();

  action = {
    type: 'CHANGE_FLOOR',
    payload: 'SOE'
  };
  roomSearchStore.handleActions(action);
  expect(roomSearchStore.getBuildingFloors).toHaveBeenCalled();

  roomSearchStore.fetchFreeRoomData.mockRestore();
  roomSearchStore.getCurrentFreeRooms.mockRestore();
  roomSearchStore.getBuildingFloors.mockRestore();
});
