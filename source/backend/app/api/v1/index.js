import { Router } from 'express';
import timetable from './timetable';

export default ({ config, db }) => {
  let v1 = Router();
  v1.use('/timetable', timetable({ config, db }));
  return v1;
};
