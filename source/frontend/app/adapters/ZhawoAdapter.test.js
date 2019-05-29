import { format, addDays } from 'date-fns';

import * as api from './ZhawoAdapter';

beforeEach(() => {
  fetch.resetMocks();
});

const ROUTE = 'route';
const NAME = 'foobar';
const STARTDATE = new Date();
const FETCH_RESPONSE = { foo: 'bar' };

it('All functions should be exported', () => {
  expect(api).toBeDefined();
  expect(api.getScheduleResource).toBeDefined();
  expect(api.getPossibleNames).toBeDefined();
});

it('getScheduleResource should call fetch give default value on empty', async () => {
  fetch.once(JSON.stringify(false));
  const response = await api.getScheduleResource(ROUTE, NAME, STARTDATE, 0);
  expect(fetch).toHaveBeenCalled();
  expect(response).toBeDefined();
  expect(response).toEqual({ weeks: {} });
});

it('getScheduleResource should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(false));
  const response = await api.getScheduleResource(ROUTE, NAME, STARTDATE, 0);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/schedules/${ROUTE}`);
  expect(response).toBeDefined();
  expect(response).toEqual({ weeks: {} });
});

it('getMensaResource should call correct api endpoint', async () => {
  const fetchResponse = ['value'];
  fetch.once(JSON.stringify(fetchResponse));
  const response = await api.getMensaResource('1', STARTDATE);
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/mensa/menus/1?`);
  expect(response).toBeDefined();
  expect(response).toEqual('value');
});

it('getAllMensas should call correct api endpoint', async () => {
  fetch.once(JSON.stringify([1, 2, 3, 4]));
  const response = await api.getAllMensas();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/mensa`);
  expect(response).toBeDefined();
  expect(response).toEqual([3, 4]);
});

it('getVszhawFeed should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await api.getVszhawFeed();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/vszhaw`);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

it('getVszhawEvents should call correct api endpoint', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const response = await api.getVszhawEvents();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/vszhaw/events`);
  expect(response).toBeDefined();
  expect(response).toEqual(FETCH_RESPONSE);
});

it('handleError should log error information', () => {
  const restore = console.log;
  console.log = jest.fn();
  api.handleError('error', 'url');
  expect(console.log).toHaveBeenCalled();
  expect(console.log.mock.calls[0][0]).toContain(`error`);
  console.log = restore;
});

it('getFreeRoomsJson should call correct api endpoint', async () => {
  const OBJECT = { someKey1: 'entry1', someKey2: 'entry2' };
  const ARRAY = ['entry1', 'entry2'];
  fetch.once(JSON.stringify(OBJECT));
  const response = await api.getFreeRoomsJson();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/roomsearch`);
  expect(response).toBeDefined();
  expect(response).toEqual(ARRAY);
});

it('convertFreeRooms should return array representation of freeRooms object', () => {
  const OBJECT = { someKey1: 'entry1', someKey2: 'entry2' };
  const ARRAY = ['entry1', 'entry2'];
  let array = api.convertFreeRooms(OBJECT);
  expect(array).toEqual(ARRAY);
});

it('getPossibleNames should call correct api endpoints and concatenate responses', async () => {
  const RESPONSE_STUDENTS = JSON.stringify({
    students: ['student1', 'student2']
  });
  const RESPONSE_LECTURERS = JSON.stringify({
    lecturers: [{ shortName: 'lecturer1' }, { shortName: 'lecturer2' }]
  });
  const RESPONSE_CLASSES = JSON.stringify({ classes: ['class1', 'class2'] });
  const RESPONSE_COURSES = JSON.stringify({
    courses: [{ name: 'course1' }, { name: 'course2' }]
  });
  const RESPONSE_ROOMS = JSON.stringify({
    rooms: ['room1', 'room2']
  });
  fetch
    .once(RESPONSE_STUDENTS)
    .once(RESPONSE_LECTURERS)
    .once(RESPONSE_CLASSES)
    .once(RESPONSE_COURSES)
    .once(RESPONSE_ROOMS);
  const response = await api.getPossibleNames();
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain(`api/v1/schedules/students/`);
  expect(fetch.mock.calls[1][0]).toContain(`api/v1/schedules/lecturers/`);
  expect(fetch.mock.calls[2][0]).toContain(`api/v1/schedules/classes/`);
  expect(fetch.mock.calls[3][0]).toContain(`api/v1/schedules/courses/`);
  expect(fetch.mock.calls[4][0]).toContain(`api/v1/schedules/rooms/`);
  expect(response).toBeDefined();
  expect(response.students).toBeDefined();
  expect(response.lecturers).toBeDefined();
  expect(response.classes).toBeDefined();
  expect(response.courses).toBeDefined();
  expect(response.rooms).toBeDefined();
  expect(response.students.length).toBe(2);
  expect(response.lecturers.length).toBe(2);
  expect(response.classes.length).toBe(2);
  expect(response.courses.length).toBe(2);
  expect(response.rooms.length).toBe(2);
  expect(response.students[0].label).toEqual('student1');
  expect(response.lecturers[0].label).toEqual('lecturer1');
  expect(response.classes[0].label).toEqual('class1');
  expect(response.courses[0].label).toEqual('course1');
  expect(response.rooms[0].label).toEqual('room1');
});

it('resolveOverlaps should return newSchedule with eventBuckets', () => {
  const INPUT_SCHEDULE = {
    weeks: {
      week1: {
        day1: {
          slots: [
            {
              testId: 'slot1',
              events: [
                {
                  testId: 'event1',
                  slots: [{ testId: 'slot1' }, { testId: 'slot2' }]
                }
              ]
            },
            {
              testId: 'slot2',
              events: [
                {
                  testId: 'event2',
                  slots: [{ testId: 'slot2' }]
                }
              ]
            },
            {
              testId: 'slot3',
              events: [
                {
                  testId: 'event3',
                  slots: [{ testId: 'slot3' }]
                }
              ]
            }
          ]
        }
      }
    }
  };
  const newSchedule = api.resolveOverlaps(INPUT_SCHEDULE);
  // should sort in event2 into bucket with first event since they overlap.
  // event3 should be in its own bucket
  const slots = newSchedule.weeks.week1.day1.slots;
  expect(slots[0].eventBucket.length).toBe(2);
  expect(slots[1].eventBucket.length).toBe(0);
  expect(slots[2].eventBucket.length).toBe(1);
  expect(slots[0].eventBucket[0].testId).toEqual('event1');
  expect(slots[0].eventBucket[0].offSetFromBucketStart).toBe(0);
  expect(slots[0].eventBucket[1].testId).toEqual('event2');
  expect(slots[0].eventBucket[1].offSetFromBucketStart).toBe(1);
  expect(slots[2].eventBucket[0].testId).toEqual('event3');
});

it('convertSchedule should reorganize schedule into weeks object with date keys and days with date keys', () => {
  const FIXED_DATE = new Date('2019-05-29T08:00:00+01:00');
  const DAY_KEY = format(FIXED_DATE, 'YYYY-MM-DD');
  const WEEK_KEY = format(FIXED_DATE, 'YYYY-MM-DD');
  const INPUT_SCHEDULE = {
    days: [
      {
        date: FIXED_DATE,
        slots: DEFAULT_SLOTS,
        events: [
          {
            testId: 'event1',
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
          },
          {
            testId: 'event2',
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
        ]
      }
    ]
  };
  const newSchedule = api.convertSchedule(INPUT_SCHEDULE);
  expect(newSchedule.weeks[WEEK_KEY]).toBeDefined();
  expect(newSchedule.weeks[WEEK_KEY][DAY_KEY]).toBeDefined();
  expect(
    newSchedule.weeks[WEEK_KEY][DAY_KEY].slots[0].events[0].testId
  ).toEqual('event1');
  expect(
    newSchedule.weeks[WEEK_KEY][DAY_KEY].slots[2].events[0].testId
  ).toEqual('event2');
});

const DEFAULT_SLOTS = [
  {
    endTime: '2018-10-29T08:45:00+01:00',
    startTime: '2018-10-29T08:00:00+01:00'
  },
  {
    endTime: '2018-10-29T09:35:00+01:00',
    startTime: '2018-10-29T08:50:00+01:00'
  },
  {
    endTime: '2018-10-29T10:45:00+01:00',
    startTime: '2018-10-29T10:00:00+01:00'
  },
  {
    endTime: '2018-10-29T11:35:00+01:00',
    startTime: '2018-10-29T10:50:00+01:00'
  },
  {
    endTime: '2018-10-29T12:45:00+01:00',
    startTime: '2018-10-29T12:00:00+01:00'
  },
  {
    endTime: '2018-10-29T13:35:00+01:00',
    startTime: '2018-10-29T12:50:00+01:00'
  },
  {
    endTime: '2018-10-29T14:45:00+01:00',
    startTime: '2018-10-29T14:00:00+01:00'
  },
  {
    endTime: '2018-10-29T15:35:00+01:00',
    startTime: '2018-10-29T14:50:00+01:00'
  },
  {
    endTime: '2018-10-29T16:45:00+01:00',
    startTime: '2018-10-29T16:00:00+01:00'
  },
  {
    endTime: '2018-10-29T17:35:00+01:00',
    startTime: '2018-10-29T16:50:00+01:00'
  },
  {
    endTime: '2018-10-29T18:30:00+01:00',
    startTime: '2018-10-29T17:45:00+01:00'
  },
  {
    endTime: '2018-10-29T19:25:00+01:00',
    startTime: '2018-10-29T18:40:00+01:00'
  },
  {
    endTime: '2018-10-29T20:10:00+01:00',
    startTime: '2018-10-29T19:25:00+01:00'
  },
  {
    endTime: '2018-10-29T21:05:00+01:00',
    startTime: '2018-10-29T20:20:00+01:00'
  },
  {
    endTime: '2018-10-29T21:50:00+01:00',
    startTime: '2018-10-29T21:05:00+01:00'
  }
];
