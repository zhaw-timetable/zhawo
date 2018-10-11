import { Router } from "express";
import username from "./username";

export default ({ config, db }) => {
  // ../api/timetable

  let router = Router();

  // import routes after timetable
  router.use("/username", username({ config, db }));

  return router;
};
