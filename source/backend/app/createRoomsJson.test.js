import * as createRooms from './createRoomsJson';

import * as api from './adapters/CampusInfoAdapter';
jest.mock('./adapters/CampusInfoAdapter');

import fs from 'fs-extra';

it('all exports should be defined', () => {
  expect(createRooms).toBeDefined();
  expect(createRooms.createFreeRoomsJson).toBeDefined();
});

it('createFreeRoomsObject should resolve with all rooms when no events', async () => {
  const ALL_ROOMS = { rooms: ['te 212', 'NotValid', 'th 488'] };
  api.getPossibleNames = jest.fn().mockReturnValue(Promise.resolve(ALL_ROOMS));
  api.getScheduleResource = jest.fn().mockReturnValue(
    Promise.resolve({
      days: [{ events: [] }],
      room: { name: 'te 212' }
    })
  );
  const freeRooms = await createRooms.createFreeRoomsObject();
  expect(freeRooms).toBeDefined();
  expect(freeRooms.length).toBe(15);
  expect(freeRooms[0].rooms.length).toBe(2);
  expect(freeRooms[0].rooms).toContainEqual('TE212');
});

it('createFreeRoomsObject should resolve with all rooms when there are events at start', async () => {
  const ALL_ROOMS = { rooms: ['th 212', 'NotValid'] };
  const EVENTS = [
    {
      slots: [
        {
          endTime: '2018-10-29T08:45:00+01:00',
          startTime: '2018-10-29T08:00:00+01:00'
        },
        {
          endTime: '2018-10-29T09:35:00+01:00',
          startTime: '2018-10-29T08:50:00+01:00'
        }
      ]
    }
  ];
  api.getPossibleNames = jest.fn().mockReturnValue(Promise.resolve(ALL_ROOMS));
  api.getScheduleResource = jest.fn().mockReturnValue(
    Promise.resolve({
      days: [{ events: EVENTS }],
      room: { name: 'th 212' }
    })
  );
  const freeRooms = await createRooms.createFreeRoomsObject();
  expect(freeRooms).toBeDefined();
  expect(freeRooms.length).toBe(15);
  expect(freeRooms[0].rooms.length).toBe(0);
  expect(freeRooms[1].rooms.length).toBe(0);
  expect(freeRooms[2].rooms.length).toBe(1);
  expect(freeRooms[2].rooms).toContainEqual('TH212');
});

it('createFreeRoomsObject should resolve with all rooms when there are events anywhere', async () => {
  const ALL_ROOMS = { rooms: ['th 212', 'NotValid'] };
  const EVENTS = [
    {
      slots: [
        {
          endTime: '2018-10-29T10:45:00+01:00',
          startTime: '2018-10-29T10:00:00+01:00'
        },
        {
          endTime: '2018-10-29T11:35:00+01:00',
          startTime: '2018-10-29T10:50:00+01:00'
        }
      ]
    }
  ];
  api.getPossibleNames = jest.fn().mockReturnValue(Promise.resolve(ALL_ROOMS));
  api.getScheduleResource = jest.fn().mockReturnValue(
    Promise.resolve({
      days: [{ events: EVENTS }],
      room: { name: 'th 212' }
    })
  );
  const freeRooms = await createRooms.createFreeRoomsObject();
  expect(freeRooms).toBeDefined();
  expect(freeRooms.length).toBe(15);
  expect(freeRooms[0].rooms.length).toBe(1);
  expect(freeRooms[0].rooms).toContainEqual('TH212');
  expect(freeRooms[1].rooms.length).toBe(1);
  expect(freeRooms[1].rooms).toContainEqual('TH212');
  expect(freeRooms[2].rooms.length).toBe(0);
  expect(freeRooms[2].rooms).not.toContainEqual('TH212');
  expect(freeRooms[3].rooms.length).toBe(0);
  expect(freeRooms[3].rooms).not.toContainEqual('TH212');
  expect(freeRooms[4].rooms.length).toBe(1);
  expect(freeRooms[4].rooms).toContainEqual('TH212');
});

it('createFreeRoomsJson should call createFreeRoomsObject and call fs module', async () => {
  jest.mock('fs-extra');
  const ALL_ROOMS = { rooms: ['th 212', 'NotValid'] };
  const EVENTS = [
    {
      slots: [
        {
          endTime: '2018-10-29T08:45:00+01:00',
          startTime: '2018-10-29T08:00:00+01:00'
        },
        {
          endTime: '2018-10-29T09:35:00+01:00',
          startTime: '2018-10-29T08:50:00+01:00'
        }
      ]
    }
  ];
  api.getPossibleNames = jest.fn().mockReturnValue(Promise.resolve(ALL_ROOMS));
  api.getScheduleResource = jest.fn().mockReturnValue(
    Promise.resolve({
      days: [{ events: EVENTS }],
      room: { name: 'th 212' }
    })
  );
  fs.writeFile = jest.fn().mockReturnValue(Promise.resolve());
  await createRooms.createFreeRoomsJson();
  expect(fs.writeFile).toHaveBeenCalled();
});
