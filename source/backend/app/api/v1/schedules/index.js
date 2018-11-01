import { Router } from 'express';

import students from './students';
import lecturers from './lecturers';
import classes from './classes';
import courses from './courses';
import rooms from './rooms';

export default ({ config, db }) => {
  let router = Router();

  // import all routes after timetable
  router.use('/students', students({ config, db }));
  router.use('/lecturers', lecturers({ config, db }));
  router.use('/classes', classes({ config, db }));
  router.use('/courses', courses({ config, db }));
  router.use('/rooms', rooms({ config, db }));

  return router;
};
