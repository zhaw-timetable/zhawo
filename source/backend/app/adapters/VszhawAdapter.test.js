import fetch from 'node-fetch';

import * as api from './VszhawAdapter';

const URL = 'https://www.vszhaw.ch/feed/';
const PARSER_RESPONSE = { items: 'items' };

beforeEach(() => {
  fetch.resetMocks();
});

it('all functions shhould be exported', () => {
  expect(api).toBeDefined();
  expect(api.parser).toBeDefined();
  expect(api.getVszhawRSS).toBeDefined();
});

it('getVszhawRSS should call correct url with parser', async () => {
  api.parser.parseURL = jest.fn(url => PARSER_RESPONSE);
  await api.getVszhawRSS();
  expect(api.parser.parseURL).toHaveBeenCalled();
  expect(api.parser.parseURL.mock.calls[0][0]).toBe(URL);
});
