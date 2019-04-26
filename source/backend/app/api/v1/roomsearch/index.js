import { Router } from 'express';

import fs from 'fs-extra';

import { logToFile } from '../../../file-logger';

export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    logToFile('Room Search', 'fetching free rooms');

    let data = await fs
      .readJson('./data/room_search_data.json')
      .catch(err => console.error(err));
    res.header('Content-Type', 'application/json');
    res.json(data);
  });

  return router;
};
