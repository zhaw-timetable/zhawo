import { Router } from "express";
import students from "./students";

export default ({ config, db }) => {
  // ../api/timetable

  let router = Router();

  // import routes after timetable
  router.use("/students", students({ config, db }));

  return router;
};
