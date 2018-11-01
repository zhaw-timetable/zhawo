import { Router } from 'express';

import * as api from '../../../adapters/CampusInfoAdapter';

export default ({ config, db }) => {
  let router = Router();

  router.post('/', async (req, res) => {
    const name = req.body.name;
    const startDate = req.body.startDate;
    const resource = await api.getResource(
      'schedules',
      'rooms',
      name,
      startDate
    );
    res.json(resource);
  });

  return router;
};
