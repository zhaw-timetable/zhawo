import { Router } from 'express';

import fs from 'fs-extra';
// import roomSearchData from '../../../../data/room_search_data.json';

import * as rss from '../../../adapters/VszhawAdapter';

export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    try {
      const feed = await rss.getVszhawRSS();
      res.header('Content-Type', 'application/json');
      res.json(feed);
    } catch (err) {
      console.error(err);
    }
  });

  const getVszhawRSS = async () => {
    console.log('Started getting vszhaw RSS Feed');
    try {
      const feed = await rss.getVszhawRSS();
      console.log('Finished getting vszhaw RSS Feed');
      return feed;
    } catch (err) {
      console.error(err);
    }
  };

  return router;
};
