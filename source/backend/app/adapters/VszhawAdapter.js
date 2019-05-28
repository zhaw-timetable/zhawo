import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { format, addMonths } from 'date-fns';
import ical from 'node-ical';

export const parser = new Parser();

/**
 * Functions that handle all communication with the vszhaw webpage
 *
 * @namespace VszhawAdapter*/

/**
 * Async Function that reads rss feed from vszhaw.ch
 *
 * @export
 * @return {Promise}  On success the promise will be resolved with a list of articles.
 */
export async function getVszhawRSS() {
  return new Promise(async (resolve, reject) => {
    let feed = await parser.parseURL('https://www.vszhaw.ch/feed/');
    resolve(feed.items);
  });
}

/**
 * Async Function that gets all vszhaw events for the current month.
 *
 * @export
 * @return {Promise}  On success the promise will be resolved with an array.
 */
export async function getVszhawEvents() {
  return new Promise(async (resolve, reject) => {
    let foundAnEvent = false;
    let monthsAhead = 0;
    let date = new Date();
    let events = [];
    while (!foundAnEvent && monthsAhead < 2) {
      date = addMonths(date, monthsAhead);
      let dateString = format(date, 'YYYY-MM');
      let url = `https://www.vszhaw.ch/events/${dateString}/?ical=1`;
      let response = await fetch(url);
      let icalString = await response.text();
      let icalData = ical.parseICS(icalString);
      Object.keys(icalData).forEach(key => {
        const entry = icalData[key];
        if (entry.type == 'VEVENT') {
          let event = {
            eventName: entry.summary,
            eventDate: new Date(entry.start).toUTCString(),
            eventUrl: entry.url
          };
          events.push(event);
        }
      });
      foundAnEvent = events.length > 0;
      monthsAhead++;
    }
    resolve(events);
  });
}
