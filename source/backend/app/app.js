import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import path from 'path';

let app = express();
app.server = http.createServer(app);

// logger if not test env
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.static(__dirname + '/bundle'));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
);

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
);

// connect to db
initializeDb(db => {
  // internal middleware
  app.use(middleware({ config, db }));

  // api router
  app.use('/api', api({ config, db }));
});

// only used in production, bundle contains frontend
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/bundle/index.html'));
});

export default app;
