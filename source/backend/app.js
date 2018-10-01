// @flow

import express from "express";
import signale from "signale";
import morgan from "morgan";
import cors from "cors";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.json());

type HeadersType = { "User-Agent": string };

app.post("/username", async (req, res) => {
  const userName: string = req.body.userName;
  const startDate: string = req.body.startDate;
  const url: string = `https://api.apps.engineering.zhaw.ch/v1/schedules/students/${userName}?startingAt=${startDate}`;
  const method: string = "GET";
  const headers: HeadersType = {
    "User-Agent": "Zhawo (https://github.com/zhaw-timetable/zhawo)"
  };
  const config = { method, headers };
  const response = await fetch(url, config).catch(err => console.log(err));
  const json = await response.json();
  res.json(json);
});

export default app;
