import request from 'supertest';
import fetch from 'node-fetch';
import { format } from 'date-fns';

import app from './app';

const FETCH_RESPONSE = { status: 'ok' };
const FIXED_DATE = new Date();
const API = '/api/v1/';

beforeEach(() => {
  fetch.resetMocks();
});

it('App should be exported correctly', () => {
  expect(app).toBeDefined();
});

it('post to /schedules/students/ should respond correctly', async () => {
  fetch.once(JSON.stringify(FETCH_RESPONSE));
  const url = `${API}/schedules/students`;
  const body = { name: 'foobar', startDate: FIXED_DATE };
  const response = await request(app)
    .post(url)
    .send(body);
  expect(response.body.status).toBe('ok');
  expect(fetch).toHaveBeenCalled();
});
