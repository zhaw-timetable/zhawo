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

if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV === 'development'
    ? app.use(morgan('dev'))
    : app.use(morgan('common'));
}

app.use(express.static(__dirname + '/bundle'));

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

// connect to db if necessary
initializeDb(db => {
  app.use(middleware({ config, db }));
  app.use('/api', api({ config, db }));
});

// only used in production, bundle contains frontend build
if (process.env.NODE_ENV === 'production') {
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/bundle/index.html'));
  });
}

export default app;
