import { version } from "../../package.json";
import { Router } from "express";
import timetable from "./timetable";

export default ({ config, db }) => {
  // ../api

  let api = Router();

  // mount the different resources
  api.use("/timetable", timetable({ config, db }));

  // expose API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  return api;
};
