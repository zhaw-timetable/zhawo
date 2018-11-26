import { Router } from 'express';

import fs from 'fs-extra';
// import roomSearchData from '../../../../data/room_search_data.json';

export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    let data = await fs
      .readJson('./data/room_search_data.json')
      .catch(err => console.error(err));
    res.header('Content-Type', 'application/json');
    res.json(data);
  });

  return router;
};
