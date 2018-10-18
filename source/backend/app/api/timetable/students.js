import fetch from "node-fetch";

import { Router } from "express";

export default ({ config, db }) => {
  // ../api/timetable/students

  let router = Router();

  // expose some API metadata at the root
  router.get("/", (req, res) => {
    res.json({ route: "api/timetable/students" });
  });

  router.post("/", async (req, res) => {
    const userName = req.body.userName;
    const startDate = req.body.startDate;
    const url = `https://api.apps.engineering.zhaw.ch/v1/schedules/students/${userName}?startingAt=${startDate}`;
    const method = "GET";
    const headers = {
      "User-Agent": "Zhawo (https://github.com/zhaw-timetable/zhawo)"
    };
    const config = { method, headers };
    const response = await fetch(url, config).catch(err => console.log(err));
    const json = await response.json();
    res.json(json);
  });

  return router;
};
