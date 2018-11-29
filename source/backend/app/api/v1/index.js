import { Router } from 'express';

import schedules from './schedules';
import roomsearch from './roomsearch';
import mensa from './mensa';

export default ({ config, db }) => {
  let v1 = Router();
  v1.use('/schedules', schedules({ config, db }));
  v1.use('/roomsearch', roomsearch({ config, db }));
  v1.use('/mensa', mensa({ config, db }));
  return v1;
};
