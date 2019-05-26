import { Router } from 'express';

import * as api from '../../../adapters/CampusInfoAdapter';

import { logToFile } from '../../../file-logger';

/**
 * Creates Router for courses
 *
 * @returns {Router}
 */
export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    const resource = await api
      .getPossibleNames('courses')
      .catch(err => console.error(err));
    res.json(resource);
  });

  router.get('/:name', async (req, res) => {
    const name = req.params.name;
    const startDate = req.query.startDate;

    logToFile('Schedules', 'fetching info for course: ' + name);

    const resource = await api
      .getScheduleResource('courses', name, startDate)
      .catch(err => console.error(err));
    res.json(resource);
  });

  return router;
};
