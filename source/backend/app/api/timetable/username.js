import fetch from "node-fetch";
import { format } from "date-fns";

import { Router } from "express";

export default ({ config, db }) => {
  // ../api/timetable/username

  let router = Router();

  // expose some API metadata at the root
  router.get("/", (req, res) => {
    res.json({ route: "api/timetable/username" });
  });

  router.post("/", async (req, res) => {
    const userName = req.body.userName;
    const startDate = req.body.startDate;
    const formattedDate = format(new Date(startDate), "YYYY-MM-DD");
    const method = "GET";
    const headers = {
      "User-Agent": "Zhawo (https://github.com/zhaw-timetable/zhawo)"
    };
    const config = { method, headers };

    // check if should try student or teacher campusinfo api
    let userType = "";
    if (userName.length === 4) {
      userType = "lecturers";
    } else {
      userType = "students";
    }
    const url = `https://api.apps.engineering.zhaw.ch/v1/schedules/${userType}/${userName}?startingAt=${formattedDate}`;
    console.log(url);
    const response = await fetch(url, config).catch(err => console.log(err));
    const json = await response.json();
    res.json(json);
  });

  return router;
};
