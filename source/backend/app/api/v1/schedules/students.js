import { Router } from 'express';

import * as api from '../../../adapters/CampusInfoAdapter';

import { logToFile } from '../../../file-logger';

export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    const resource = await api
      .getPossibleNames('students')
      .catch(err => console.error(err));
    res.json(resource);
  });

  router.get('/:name', async (req, res) => {
    const name = req.params.name;
    const startDate = req.query.startDate;

    logToFile('Schedules', 'fetching info for student: ' + name);

    const resource = await api
      .getScheduleResource('students', name, startDate, 7)
      .catch(err => console.error(err));
    res.json(resource);
  });

  return router;
};
