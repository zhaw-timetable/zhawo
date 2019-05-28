import fetch from 'node-fetch';
import ical from 'node-ical';

import * as vszhawApi from './VszhawAdapter';

const URL = 'https://www.vszhaw.ch/feed/';
const PARSER_RESPONSE = { items: 'items' };

beforeEach(() => {
  fetch.resetMocks();
});

it('all functions shhould be exported', () => {
  expect(vszhawApi).toBeDefined();
  expect(vszhawApi.parser).toBeDefined();
  expect(vszhawApi.getVszhawRSS).toBeDefined();
});

it('getVszhawRSS should call correct url with parser', async () => {
  vszhawApi.parser.parseURL = jest
    .fn()
    .mockReturnValue(Promise.resolve(PARSER_RESPONSE));
  let feedItems = await vszhawApi.getVszhawRSS();
  expect(vszhawApi.parser.parseURL).toHaveBeenCalled();
  expect(vszhawApi.parser.parseURL).toHaveBeenCalledWith(URL);
  expect(feedItems).toEqual(PARSER_RESPONSE.items);
  vszhawApi.parser.parseURL.mockRestore();
});

it('getVszhawEvents should resolve with array of events based on received ical string response', async () => {
  jest.mock('node-ical');
  const FIXED_DATE = new Date();
  const ICAL_DATA = {
    idOne: {
      type: 'VEVENT',
      summary: 'eventSummary',
      start: FIXED_DATE.toString(),
      url: 'eventUrl'
    },
    idTwo: {
      type: 'NOT_VEVENT'
    }
  };
  ical.parseICS = jest.fn().mockReturnValue(ICAL_DATA);
  fetch.mockResponse('responseString');
  let events = await vszhawApi.getVszhawEvents();
  expect(ical.parseICS).toHaveBeenCalled();
  expect(ical.parseICS).toHaveBeenCalledWith('responseString');
  expect(events.length).toBe(1);
  expect(events[0].eventName).toEqual('eventSummary');
  expect(events[0].eventDate).toEqual(FIXED_DATE.toUTCString());
  expect(events[0].eventUrl).toEqual('eventUrl');
});
