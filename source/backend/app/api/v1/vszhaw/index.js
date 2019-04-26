import { Router } from 'express';

import fs from 'fs-extra';
// import roomSearchData from '../../../../data/room_search_data.json';

import * as vszhawApi from '../../../adapters/VszhawAdapter';

import { logToFile } from '../../../file-logger';

export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    try {
      logToFile('Vszhaw', 'fetching rss feed ');

      const feed = await vszhawApi.getVszhawRSS();
      res.header('Content-Type', 'application/json');
      res.json(feed);
    } catch (err) {
      console.error(err);
    }
  });

  router.get('/events', async (req, res) => {
    try {
      const events = await vszhawApi.getVszhawEvents();
      res.header('Content-Type', 'application/json');
      res.json(events);
    } catch (err) {
      console.error(err);
    }
  });

  return router;
};
