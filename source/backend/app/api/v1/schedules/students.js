import { Router } from 'express';

import * as api from '../../../adapters/CampusInfoAdapter';

export default ({ config, db }) => {
  let router = Router();

  router.post('/', async (req, res) => {
    const name = req.body.name;
    const startDate = req.body.startDate;
    const resource = await api
      .getScheduleResource('students', name, startDate)
      .catch(err => console.error(err));
    res.json(resource);
  });

  return router;
};
