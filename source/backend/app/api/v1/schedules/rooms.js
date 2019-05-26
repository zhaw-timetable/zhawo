import { Router } from 'express';

import * as api from '../../../adapters/CampusInfoAdapter';

import { logToFile } from '../../../file-logger';

/**
 * Creates Router for rooms
 *
 * @returns {Router}
 */
export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    const resource = await api
      .getPossibleNames('rooms')
      .catch(err => console.error(err));
    res.json(resource);
  });

  router.get('/:name', async (req, res) => {
    const name = req.params.name;
    const startDate = req.query.startDate;

    logToFile('Schedules', 'fetching info for room: ' + name);

    const resource = await api
      .getScheduleResource('rooms', name, startDate)
      .catch(err => console.error(err));
    res.json(resource);
  });

  return router;
};
