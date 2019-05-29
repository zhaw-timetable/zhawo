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
});

// fetch.mockResponses([JSON.stringify(FETCH_RESPONSE), JSON.stringify(FETCH_RESPONSE),JSON.stringify(FETCH_RESPONSE),JSON.stringify(FETCH_RESPONSE),JSON.stringify(FETCH_RESPONSE)]);
