import { Router } from 'express';

import * as api from '../../../adapters/CampusInfoAdapter';

export default ({ config, db }) => {
  let router = Router();

  router.get('/', async (req, res) => {
    const resource = await api.getFacilities().catch(err => console.error(err));
    res.json(resource);
  });

  router.get('/menus/:facilityId', async (req, res) => {
    const facilityId = req.params.facilityId;
    const startDate = req.query.startDate;
    const resource = await api
      .getMensaResource(facilityId, startDate)
      .catch(err => console.error(err));
    res.json(resource);
  });

  return router;
};
