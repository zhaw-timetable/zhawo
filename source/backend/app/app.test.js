import request from 'supertest';
import fetch from 'node-fetch';
import { format } from 'date-fns';

import { version } from '../package.json';
import app from './app';

beforeEach(() => {
  fetch.resetMocks();
});

it('App should be exported correctly', () => {
  expect(app).toBeDefined();
});

it('GET to /api/ should respond correctly', async () => {
  const response = await request(app).get('/api/');
  expect(response.body.version).toBe(version);
});

const STUDENT_NAME = 'somestud';
const LECTURER_NAME = 'lect';
const STARTDATE = new Date();

it('POST to /api/timetable/username/ should respond correctly', async () => {
  fetch.mockResponse(JSON.stringify({ status: 'ok' }));
  const response = await request(app)
    .post('/api/timetable/username')
    .send({
      userName: STUDENT_NAME,
      startDate: STARTDATE
    });
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});

it('POST to /api/timetable/username/ should call /students/ endpoint for student', async () => {
  fetch.mockResponse(JSON.stringify({ status: 'ok' }));
  const response = await request(app)
    .post('/api/timetable/username')
    .send({
      userName: STUDENT_NAME,
      startDate: STARTDATE
    });
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain('/students/');
  expect(fetch.mock.calls[0][0]).toContain(STUDENT_NAME);
  expect(fetch.mock.calls[0][0]).toContain(format(STARTDATE, 'YYYY-MM-DD'));
});

it('POST to /api/timetable/username/ should call /lecturers/ endpoint for lecturer', async () => {
  fetch.mockResponse(JSON.stringify({ status: 'ok' }));
  const response = await request(app)
    .post('/api/timetable/username')
    .send({
      userName: LECTURER_NAME,
      startDate: STARTDATE
    });
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain('/lecturers/');
  expect(fetch.mock.calls[0][0]).toContain(LECTURER_NAME);
  expect(fetch.mock.calls[0][0]).toContain(format(STARTDATE, 'YYYY-MM-DD'));
});
